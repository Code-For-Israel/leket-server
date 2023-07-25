import { Injectable, Logger } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoriesService } from '../histories/histories.service';
import { Field, FieldStatus, Prisma, PrismaClient } from '@prisma/client';
import { Point, Polygon } from 'geojson';
import { _ } from 'lodash';
import {
  FieldAndGeometry,
  FieldGeometry,
  FieldIdsIntersectionsPrisma,
} from './field-types';
import { FilterFieldDto } from './dto/filter-field.dto';

@Injectable()
export class FieldsService {
  private readonly polygon = 'polygon';
  private readonly point = 'point';

  constructor(
    private prisma: PrismaService,
    private historiesService: HistoriesService,
    private logger: Logger = new Logger(FieldsService.name),
  ) {}

  async create(createFieldDto: CreateFieldDto) {
    try {
      const { fieldGeometry, fieldWithoutGeometry } =
        this.extractGeometryFromField(createFieldDto);
      const field = await this.prisma.$transaction(
        async (transactionPrisma: PrismaClient) => {
          const field = await transactionPrisma.field.create({
            data: {
              ...fieldWithoutGeometry,
              Histories: {
                create: {
                  product_name: fieldWithoutGeometry.product_name,
                  farmer_id: fieldWithoutGeometry.farmer_id,
                },
              },
            },
          });
          await this.createGeometryToField(
            field.id,
            fieldGeometry,
            transactionPrisma,
          );
          return field;
        },
      );
      this.logger.log('Field created', field);
      return this.concatFieldsWithGeometry(field, fieldGeometry);
    } catch (error) {
      if (error instanceof GeometryCreationFailedError) {
        this.logger.error('Error creating field geometry: ', error);
      } else {
        this.logger.error('Error creating field', error);
      }
      throw error;
    }
  }

  async findAllByFilter(filters: FilterFieldDto): Promise<any> {
    this.logger.log('fieldsService -> findAll -> Enter');
    const {
      prefixName,
      products,
      regions,
      familiarities,
      careStatuses,
      fieldCategories,
      sortBy,
      sortDir,
      page,
      pageSize,
      polygonFilter,
      filterNdviRange,
      filterDateRange,
      filterAttractivenessRange,
    } = filters;

    const intersectedFields: number[] = polygonFilter
      ? await this.findIntersectedFields(polygonFilter)
      : undefined;

    const where = await this.createWhereClause(
      intersectedFields,
      prefixName,
      products,
      regions,
      familiarities,
      careStatuses,
      fieldCategories,
      filterNdviRange,
      filterAttractivenessRange,
      filterDateRange,
    );

    const skip = page * pageSize;
    const take = pageSize;

    const searchResult = await this.searchFields(
      where,
      skip,
      take,
      sortBy,
      sortDir,
    );

    this.logger.log(
      `fieldsService -> findAll -> found ${searchResult.fields.length} fields`,
    );
    const fieldsWithGeo = await this.getFieldsGeometry(searchResult.fields);
    const fieldCount = searchResult.fieldsCount;

    return { fieldsWithGeo, fieldCount };
  }

  async findOne(id: number, fieldGeometry: FieldGeometry = null) {
    const field = await this.prisma.field.findUnique({ where: { id } });
    if (field) {
      if (fieldGeometry) {
        return this.concatFieldsWithGeometry(field, fieldGeometry);
      }
      return this.getFieldWithGeometry(field);
    }
    return {};
  }

  async updateOne(
    id: number,
    updateFieldDto: UpdateFieldDto,
    prismaClient: PrismaClient = this.prisma,
    performOwnTransaction = true,
  ) {
    try {
      const { fieldGeometry, fieldWithoutGeometry } =
        this.extractGeometryFromField(updateFieldDto);
      this.prepareToStatusUpdateIfRequired(fieldWithoutGeometry);
      const [fieldGeometryRes, updateFieldRes] =
        await this.updateOneTransaction(
          performOwnTransaction,
          prismaClient,
          fieldGeometry,
          fieldWithoutGeometry,
          id,
          updateFieldDto,
        );

      if (fieldGeometryRes?.length > 0) {
        return this.concatFieldsWithGeometry(
          updateFieldRes,
          fieldGeometryRes[0],
        );
      } else {
        return this.getFieldWithGeometry(updateFieldRes);
      }
    } catch (error) {
      this.logger.log('Error updating Field', error);
      throw error;
    }
  }

  async updateOneTransaction(
    performOwnTransaction: boolean,
    prismaClient: PrismaClient,
    fieldGeometry: FieldGeometry,
    fieldWithoutGeometry: Field,
    id: number,
    updateFieldDto: UpdateFieldDto,
  ) {
    if (performOwnTransaction) {
      return this.prisma.$transaction(
        async (transactionPrisma: PrismaClient) => {
          const [updateFieldRes, fieldGeometryRes] = await Promise.all([
            transactionPrisma.field.update({
              where: { id },
              data: fieldWithoutGeometry,
            }),
            this.updateGeometryToField(id, fieldGeometry, transactionPrisma),
          ]);
          await this.createHistoryForFieldIfRequired(
            updateFieldRes,
            updateFieldDto,
            transactionPrisma,
          );
          return [fieldGeometryRes, updateFieldRes];
        },
      );
    } else {
      const [updateFieldRes, fieldGeometryRes] = await Promise.all([
        prismaClient.field.update({
          where: { id },
          data: fieldWithoutGeometry,
        }),
        this.updateGeometryToField(id, fieldGeometry, prismaClient),
      ]);
      await this.createHistoryForFieldIfRequired(
        updateFieldRes,
        updateFieldDto,
        prismaClient,
      );
      return [fieldGeometryRes, updateFieldRes];
    }
  }

  async remove(id: number) {
    const removeFieldRes = await this.prisma.field.delete({ where: { id } });
    return this.deleteHistoriesForField(removeFieldRes);
  }

  async getFieldByPoint(point: Point): Promise<Field | any> {
    const fieldGeometry: any[] = await this.prisma
      .$queryRaw`SELECT field_id, ST_AsGeoJson(polygon) as polygon, ST_AsGeoJson(point) as point FROM "Geometry" WHERE ST_Within(ST_GeomFromGeoJSON(${point}), "Geometry".polygon)`;
    if (fieldGeometry.length > 0) {
      const { field_id: fieldId, polygon, point } = fieldGeometry[0]; // field polygon is unique
      return this.findOne(fieldId, { polygon, point });
    } else {
      return {};
    }
  }

  private async searchFields(where, skip, take, sortBy, sortDir) {
    const filterByFarmerId = _.omit(where, ['name']);
    const [fields, count] = await Promise.all([
      this.prisma.field.findMany({
        where: filterByFarmerId,
        orderBy: sortBy ? { [sortBy]: sortDir ?? 'asc' } : undefined,
        skip,
        take,
      }),
      this.prisma.field.count({ where: filterByFarmerId }),
    ]);

    if (fields.length !== 0) {
      return { fields, fieldsCount: count };
    } else {
      const filterByName = _.omit(where, ['farmer_id']);
      const [fields, count] = await Promise.all([
        this.prisma.field.findMany({
          where: filterByName,
          orderBy: sortBy ? { [sortBy]: sortDir ?? 'asc' } : undefined,
          skip,
          take,
        }),
        this.prisma.field.count({ where: filterByName }),
      ]);
      return { fields, fieldsCount: count };
    }
  }

  private async createWhereClause(
    fieldIds,
    prefixName,
    products,
    regions,
    familiarities,
    careStatuses,
    fieldCategories,
    filterNdviRange,
    filterAttractivenessRange,
    filterDateRange,
  ) {
    // The order of the returned object is important for the query to utilize the indexes properly
    const whereClause = {
      name: prefixName ? { startsWith: prefixName } : undefined,
      farmer_id: prefixName,
      latest_attractiveness_metric: filterAttractivenessRange
        ? {
            gte: filterAttractivenessRange?.attractivenessFrom,
            lte: filterAttractivenessRange?.attractivenessTo,
          }
        : undefined,
      latest_satellite_metric: filterNdviRange
        ? {
            gte: filterNdviRange?.ndviFrom,
            lte: filterNdviRange?.ndviTo,
          }
        : undefined,
      status_date: filterDateRange
        ? {
            gte: filterDateRange?.dateFrom || undefined,
            lte: filterDateRange?.dateTo || undefined,
          }
        : undefined,
      id: fieldIds ? { in: fieldIds } : undefined,
      product_name:
        products && products.length > 0 ? { in: products } : undefined,
      region: regions && regions.length > 0 ? { in: regions } : undefined,
      familiarity:
        familiarities && familiarities.length > 0
          ? { in: familiarities }
          : undefined,
      status:
        careStatuses && careStatuses.length > 0
          ? { in: careStatuses }
          : undefined,
      category:
        fieldCategories && fieldCategories.length > 0
          ? { in: fieldCategories }
          : undefined,
    };

    return _.omitBy(whereClause, _.isUndefined);
  }

  private async findIntersectedFields(
    polygonFilter: Polygon,
  ): Promise<number[]> {
    if (polygonFilter) {
      const intersectedFields: FieldIdsIntersectionsPrisma[] =
        await this.prisma.$queryRaw(
          Prisma.sql`SELECT field_id FROM "Geometry" WHERE ST_Intersects(ST_GeomFromGeoJSON(${polygonFilter}), "Geometry".polygon);`,
        );
      return intersectedFields.map((field) => field.field_id);
    }
  }

  private async createHistoryForFieldIfRequired(
    fieldDto: Field,
    updateFieldDto: UpdateFieldDto,
    prismaClient: PrismaClient = this.prisma,
  ) {
    if (updateFieldDto.product_name || updateFieldDto.farmer_id) {
      const historyUpdateDto = {
        field_id: fieldDto.id,
        product_name: fieldDto.product_name,
        farmer_id: fieldDto.farmer_id,
      };
      const historyCreateRes = await this.historiesService.create(
        historyUpdateDto,
        prismaClient,
      );
      this.logger.log('History created for field', historyCreateRes);
    }
  }

  private async deleteHistoriesForField(fieldDto: Field) {
    try {
      await this.historiesService.remove_by_field_id(fieldDto.id);
      this.logger.log('Deleted histories for field id: ' + fieldDto.id);
    } catch (e) {
      this.logger.error(
        'Error deleting histories for field id: ' + fieldDto.id,
      );
    }
  }

  private async createGeometryToField(
    field_id: number,
    fieldGeometry: FieldGeometry,
    prismaClient: PrismaClient = this.prisma,
  ): Promise<any> {
    try {
      if (fieldGeometry.polygon && fieldGeometry.point) {
        await prismaClient.$queryRaw(
          Prisma.sql`INSERT INTO "Geometry" (field_id, polygon, point) VALUES (${field_id}, ST_GeomFromGeoJSON(${fieldGeometry.polygon}), ST_GeomFromGeoJSON(${fieldGeometry.point}));`,
        );
      } else if (fieldGeometry.polygon) {
        await prismaClient.$queryRaw(
          Prisma.sql`INSERT INTO "Geometry" (field_id, polygon) VALUES (${field_id}, ST_GeomFromGeoJSON(${fieldGeometry.polygon}));`,
        );
      } else if (fieldGeometry.point) {
        await prismaClient.$queryRaw(
          Prisma.sql`INSERT INTO "Geometry" (field_id, point) VALUES (${field_id}, ST_GeomFromGeoJSON(${fieldGeometry.point}));`,
        );
      }
    } catch (e) {
      throw new GeometryCreationFailedError(
        'Error creating geometry for field',
      );
    }
  }

  private async updateGeometryToField(
    field_id: number,
    fieldGeometry: FieldGeometry,
    prismaClient: PrismaClient = this.prisma,
  ): Promise<any> {
    try {
      if (fieldGeometry.polygon && fieldGeometry.point) {
        return prismaClient.$queryRaw(
          Prisma.sql`UPDATE "Geometry" SET polygon = ST_GeomFromGeoJSON(${fieldGeometry.polygon}), point = ST_GeomFromGeoJSON(${fieldGeometry.point}) WHERE field_id = ${field_id} returning field_id, ST_AsGeoJSON(polygon) as polygon, ST_AsGeoJSON(point) as point;`,
        );
      } else if (fieldGeometry.polygon) {
        return prismaClient.$queryRaw(
          Prisma.sql`UPDATE "Geometry" SET polygon = ST_GeomFromGeoJSON(${fieldGeometry.polygon}) WHERE field_id = ${field_id} returning field_id, ST_AsGeoJSON(polygon) as polygon, ST_AsGeoJSON(point) as point;`,
        );
      } else if (fieldGeometry.point) {
        return prismaClient.$queryRaw(
          Prisma.sql`UPDATE "Geometry" SET point = ST_GeomFromGeoJSON(${fieldGeometry.point}) WHERE field_id = ${field_id} returning field_id, ST_AsGeoJSON(polygon) as polygon, ST_AsGeoJSON(point) as point;`,
        );
      }
    } catch (e) {
      throw new GeometryCreationFailedError(
        'Error creating geometry for field',
      );
    }
  }

  private async getFieldWithGeometry(field: Field): Promise<Field> {
    try {
      const fieldId = field.id;
      const fieldGeometryRes: any[] = await this.prisma.$queryRaw(
        Prisma.sql`SELECT ST_AsGeoJSON(polygon) as polygon, ST_AsGeoJSON(point) as point FROM "Geometry" WHERE field_id = ${fieldId};`,
      );
      if (fieldGeometryRes.length === 0) {
        this.logger.warn('No geometry found for field id: ' + fieldId);
        return field;
      }
      return this.concatFieldsWithGeometry(field, fieldGeometryRes[0]);
    } catch (e) {
      this.logger.error('Error getting geometry for field id: ' + field.id);
      throw e;
    }
  }

  private prepareToStatusUpdateIfRequired(updateFieldDto: UpdateFieldDto) {
    if (updateFieldDto.status) {
      updateFieldDto.status_date = new Date();
      if (updateFieldDto.status !== FieldStatus.ON_HOLD) {
        updateFieldDto.delay_date = null;
      }
    }
  }

  /**
   * @param fields
   * @returns fields with geometry
   * **/
  private async getFieldsGeometry(fields: Field[]): Promise<Field[]> {
    return await Promise.all(
      fields.map(async (field) => {
        return this.getFieldWithGeometry(field);
      }),
    );
  }

  private async concatFieldsWithGeometry(
    field: Field,
    geometry: FieldGeometry,
  ): Promise<Field> {
    return Object.assign({}, field, geometry);
  }

  private extractGeometryFromField(
    createFieldDto: CreateFieldDto | UpdateFieldDto,
  ): FieldAndGeometry {
    const fieldGeometry: FieldGeometry = {
      polygon: createFieldDto.polygon,
      point: createFieldDto.point,
    };
    const fieldWithoutGeometry: Field = _.omit(createFieldDto, [
      'polygon',
      'point',
    ]);

    return { fieldGeometry, fieldWithoutGeometry };
  }
}

class GeometryCreationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeometryCreationFailed';
  }
}

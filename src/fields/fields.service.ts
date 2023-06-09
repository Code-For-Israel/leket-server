import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoriesService } from '../histories/histories.service';
import { Field, Prisma } from '@prisma/client';
import { Point, Polygon } from 'geojson';
import { _ } from 'lodash';
import { FieldStatus } from '@prisma/client';
import { FieldGeometry, FieldIdsIntersectionsPrisma } from './field-types';
import { FilterFieldDto } from './dto/filter-field.dto';

@Injectable()
export class FieldsService {
  private readonly polygon = 'polygon';
  private readonly point = 'point';
  constructor(
    private prisma: PrismaService,
    private historiesService: HistoriesService,
  ) {}
  async create(createFieldDto: CreateFieldDto) {
    // TODO: transact history creation
    const fieldPolygon = createFieldDto.polygon;
    const fieldPoint = createFieldDto.point;
    const fieldWithoutGeometry = _.omit(createFieldDto, [
      this.polygon,
      this.point,
    ]);
    try {
      const field = await this.prisma.field.create({
        data: fieldWithoutGeometry,
      });
      console.log('Field created', field);
      await this.createGeometryToField(field.id, fieldPolygon, fieldPoint);
      return field;
    } catch (error) {
      if (error instanceof GeometryCreationFailedError) {
        console.error('Error creating field geometry: ', error);
      } else {
        console.error('Error creating field', error);
      }
      throw error;
    }
  }

  async findAllByFilter(filters: FilterFieldDto): Promise<any> {
    console.log('fieldsService -> findAll -> Enter');
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

    const [fields, fieldCount] = await Promise.all([
      this.prisma.field.findMany({
        where,
        orderBy: sortBy ? { [sortBy]: sortDir ?? 'asc' } : undefined,
        skip,
        take,
      }),
      this.prisma.field.count({ where }),
    ]);

    console.log(`fieldsService -> findAll -> found ${fields.length} fields`);
    const fieldsWithGeo = await this.getFieldsGeometry(fields);

    return { fieldsWithGeo, fieldCount };
  }

  async findOne(id: number, fieldGeometry: FieldGeometry = null) {
    const field = await this.prisma.field.findUnique({ where: { id } });
    if (field) {
      if (fieldGeometry) {
        return this.concatFieldsWithGeometry(field, fieldGeometry);
      }
      return this.getGeometryForField(field);
    }
    return {};
  }

  async updateOne(id: number, updateFieldDto: UpdateFieldDto) {
    // TODO: add filter validation
    try {
      this.prepareToStatusUpdateIfRequired(updateFieldDto);
      return await this.prisma.$transaction(async (transactionPrisma) => {
        const updateFieldRes = await transactionPrisma.field.update({
          where: { id },
          data: updateFieldDto,
        });
        await this.createHistoryForFieldIfRequired(
          updateFieldRes,
          updateFieldDto,
        );
        return this.getFieldsGeometry([updateFieldRes]);
      });
    } catch (error) {
      console.log('Error updating Field', error);
      throw error;
    }
  }

  async remove(id: number) {
    const removeFieldRes = await this.prisma.field.delete({ where: { id } });
    await this.deleteHistoriesForField(removeFieldRes);
    return 'ok';
  }

  async getFieldByPoint(point: Point): Promise<Field | any> {
    const fieldGeometry: any[] = await this.prisma
      .$queryRaw`SELECT field_id, ST_AsText(polygon) as polygon, ST_AsText(point) as point FROM "Geometry" WHERE ST_Within(ST_GeomFromGeoJSON(${point}), "Geometry".polygon)`;
    if (fieldGeometry.length > 0) {
      const { field_id: fieldId, polygon, point } = fieldGeometry[0]; // field polygon is unique
      return this.findOne(fieldId, { polygon, point });
    } else {
      return {};
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
      latest_attractiveness_metric: filterAttractivenessRange
        ? {
            gte: filterAttractivenessRange?.attractivenessFrom,
            lte: filterAttractivenessRange?.attractivenessTo,
          }
        : undefined,
      latest_satelite_metric: filterNdviRange
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
      familiarities:
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
  ) {
    if (updateFieldDto.product_name || updateFieldDto.farmer_id) {
      const historyUpdateDto = {
        field_id: fieldDto.id,
        product_name: fieldDto.product_name,
        farmer_id: fieldDto.farmer_id,
      };
      const historyCreateRes = await this.historiesService.create(
        historyUpdateDto,
      );
      console.log('History created for field', historyCreateRes);
    }
  }

  private async deleteHistoriesForField(fieldDto: Field) {
    try {
      await this.historiesService.remove_by_field_id(fieldDto.id);
      console.log('Deleted histories for field id: ' + fieldDto.id);
    } catch (e) {
      console.error('Error deleting histories for field id: ' + fieldDto.id);
    }
  }

  private async createGeometryToField(
    field_id: number,
    fieldPolygon: Polygon,
    fieldPoint: Point,
  ) {
    try {
      await this.prisma.$queryRaw(
        Prisma.sql`INSERT INTO "Geometry" (field_id, polygon, point) VALUES (${field_id}, ST_GeomFromGeoJSON(${fieldPolygon}), ST_GeomFromGeoJSON(${fieldPoint}));`,
      );
    } catch (e) {
      throw new GeometryCreationFailedError(
        'Error creating geometry for field',
      );
    }
  }

  private async getGeometryForField(field: Field): Promise<Field> {
    try {
      const fieldId = field.id;
      const fieldGeometryRes: any[] = await this.prisma.$queryRaw(
        Prisma.sql`SELECT ST_AsGeoJSON(polygon) as polygon, ST_AsGeoJSON(point) as point FROM "Geometry" WHERE field_id = ${fieldId};`,
      );
      if (fieldGeometryRes.length === 0) {
        console.error('No geometry found for field id: ' + fieldId);
        return field;
      }
      return this.concatFieldsWithGeometry(field, fieldGeometryRes[0]);
    } catch (e) {
      console.error('Error getting geometry for field id: ' + field.id);
      throw e;
    }
  }

  private prepareToStatusUpdateIfRequired(updateFieldDto: UpdateFieldDto) {
    if (updateFieldDto.status) {
      updateFieldDto.status_date = new Date();
      updateFieldDto.delay_date =
        updateFieldDto.status === FieldStatus.ON_HOLD ? new Date() : null;
    }
  }

  /**
   * @param fields
   * @returns fields with geometry
   * **/
  private async getFieldsGeometry(fields: Field[]): Promise<Field[]> {
    return await Promise.all(
      fields.map(async (field) => {
        return this.getGeometryForField(field);
      }),
    );
  }

  private async concatFieldsWithGeometry(
    field: Field,
    geometry: FieldGeometry,
  ): Promise<Field> {
    return Object.assign({}, field, geometry);
  }
}

class GeometryCreationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeometryCreationFailed';
  }
}

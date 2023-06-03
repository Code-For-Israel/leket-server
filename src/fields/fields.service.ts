import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoriesService } from '../histories/histories.service';
import { Field, Prisma } from '@prisma/client';
import { Point, Polygon } from 'geojson';
import { _ } from 'lodash';
import { FieldStatus } from '@prisma/client';
import { fieldIdsIntersectionsPrisma } from './field-types';
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
            await this.addGeometryToField(field.id, fieldPolygon, fieldPoint);
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

    async findAll(filters: FilterFieldDto): Promise<any> {
        console.log('fieldsService -> findAll -> Enter');
        console.log(filters);
        const {
            name,
            products,
            regions,
            careStatuses,
            sortBy,
            sortDir,
            page,
            pageSize,
            polygonFilter,
        } = filters;

        const intersectedFields: number[] = await this.findIntersectedFields(
            polygonFilter,
        );

        const where = await this.createWhereClause(
            intersectedFields,
            name,
            products,
            regions,
            careStatuses,
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
            this.prisma.field.count({ where })
        ]);

        console.log(`fieldsService -> findAll -> found ${fields.length} fields`);

        const fieldsWithGeo = [];

        for (const field in fields) {
            const geoData = await this.prisma.$queryRaw(
                Prisma.sql`SELECT ST_AsGeoJSON(polygon) as polygon, ST_AsGeoJSON(point) as point FROM "Geometry" WHERE field_id = ${fields[field].id};`
            );

            fieldsWithGeo.push(Object.assign({}, fields[field], geoData[0]));
        }
        return { fieldsWithGeo, fieldCount };
    }

    async findOne(id: number) {
        const field = await this.prisma.field.findUnique({ where: { id } });
        const fieldGeometry = await this.getGeometryForField(id);
        return _.assign({}, field, fieldGeometry);
    }

    findByFilter(filter: any) {
        // TODO: add filter validation
        return this.prisma.field.findMany({ where: filter });
    }

    async updateFieldStatus(id: number, status: FieldStatus) {
        console.log(
            `fieldsService -> updateFieldStatus -> Enter. id=${id}, status=${status}`,
        );
        try {
            await this.prisma.field.update({
                where: { id },
                data: {
                    status,
                },
            });
            return this.prisma.field.findUnique({ where: { id } });
        } catch (error) {
            console.log('Error updating Field status', error);
        }
    }

    async update(id: number, updateFieldDto: UpdateFieldDto) {
        try {
            const updateFieldRes = await this.prisma.field.update({
                where: { id },
                data: updateFieldDto,
            });
            if (updateFieldDto.product_name || updateFieldDto.farmer_id) {
                await this.createHistoryForField(updateFieldRes);
            }
        } catch (error) {
            console.log('Error updating Field', error);
        }
    }

    async remove(id: number) {
        const removeFieldRes = await this.prisma.field.delete({ where: { id } });
        await this.deleteHistoriesForField(removeFieldRes);
        return 'ok';
    }

    private async createWhereClause(
        fieldIds,
        searchedText,
        products,
        regions,
        careStatuses,
    ) {
        return {
            id: fieldIds ? { in: fieldIds } : undefined,
            name: searchedText ? {contains: searchedText} : undefined,
            product_name:
                products && products.length > 0 ? { in: products } : undefined,
            region: regions && regions.length > 0 ? { in: regions } : undefined,
            status:
                careStatuses && careStatuses.length > 0
                    ? { in: careStatuses }
                    : undefined,
        };
    }

    private async findIntersectedFields(
        polygonFilter: Polygon,
    ): Promise<number[]> {
        if (polygonFilter) {
            const intersectedFields: fieldIdsIntersectionsPrisma[] =
                await this.prisma.$queryRaw(
                    Prisma.sql`SELECT field_id FROM "Geometry" WHERE ST_Intersects(ST_GeomFromGeoJSON(${polygonFilter}), "Geometry".polygon);`,
                );
            return intersectedFields.map((field) => field.field_id);
        }
    }

    private async createHistoryForField(fieldDto: Field) {
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

    private async deleteHistoriesForField(fieldDto: Field) {
        try {
            await this.historiesService.remove_by_field_id(fieldDto.id);
            console.log('Deleted histories for field id: ' + fieldDto.id);
        } catch (e) {
            console.error('Error deleting histories for field id: ' + fieldDto.id);
        }
    }

    private async addGeometryToField(
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

    private async getGeometryForField(field_id: number) {
        try {
            const fieldGeometryRes: any[] = await this.prisma.$queryRaw(
                Prisma.sql`SELECT ST_AsGeoJSON(polygon) as polygon, ST_AsGeoJSON(point) as point FROM "Geometry" WHERE field_id = ${field_id};`,
            );
            if (fieldGeometryRes.length === 0) {
                throw new Error('No geometry found for field id: ' + field_id);
            }
            return fieldGeometryRes[0];
        } catch (e) {
            throw e;
        }
    }
}

class GeometryCreationFailedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GeometryCreationFailed';
    }
}

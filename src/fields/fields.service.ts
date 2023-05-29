import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { FilterFieldDto } from './dto/filter-field.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoriesService } from '../histories/histories.service';
import { Field, Prisma } from '@prisma/client';

@Injectable()
export class FieldsService {
    constructor(
        private prisma: PrismaService,
        private historiesService: HistoriesService,
    ) {}
    async create(createFieldDto: CreateFieldDto) {
        return this.prisma.field.create({ data: createFieldDto});
    }

    // async create1(createFieldDto: CreateFieldDto) {
    //     const fieldRes = await this.prisma // queryRaw is used since polygon is not supported by Prisma
    //         .$queryRaw(Prisma.sql`INSERT INTO "Field" (name, product_name, farmer_id, region, familiarity,
    //         familiarity_desc, latitude, longitude, polygon, latest_satelite_metric,
    //         category, status, status_date, delay_date, created_date)
    //          VALUES (${createFieldDto.name}, CAST(${createFieldDto.product_name} AS "Product"), ${createFieldDto.farmer_id}, CAST(${createFieldDto.region} AS "Region"),
    //                  CAST(${createFieldDto.familiarity} AS "Familiarity"), ${createFieldDto.familiarity_desc}, ${createFieldDto.latitude}, ${createFieldDto.longitude}, ST_GeomFromGeoJSON(${createFieldDto.polygon}),
    //                  ${createFieldDto.latest_satelite_metric}, CAST(${createFieldDto.category} AS "FieldCategory"), CAST(${createFieldDto.status} AS "FieldStatus"),
    //                  CAST(${createFieldDto.status_date} AS date), CAST(${createFieldDto.delay_date} AS date), CAST(${createFieldDto.created_date} AS date))
    //          RETURNING id, name, product_name, farmer_id, region, familiarity,
    //         familiarity_desc, latitude, longitude, CAST(polygon AS varchar), latest_satelite_metric,
    //         category, status, status_date, delay_date, created_date;`);
    //     await this.createHistoryForField(fieldRes[0]);
    //     return fieldRes;
    // }

    async findAll(filters: any) {
        console.log("fieldsService -> findAll -> Enter");
        console.log(filters);
        const { name, status, products, regions, careStatuses, sortBy, sortDir, page, pageSize } = filters;

        const skip = page * pageSize;
        const take = pageSize;

        const where = {
            name: name ?? undefined,
                product_name: products && products.length > 0 ?
                {
                    in: products,
                }
                : undefined,
                region: regions && regions.length > 0 ?
                {
                    in: regions,
                }
                : undefined,
                status: careStatuses && careStatuses.length > 0 ?
                {
                    in: careStatuses,
                }
                : undefined,
        };

        const fields = await this.prisma.field.findMany({
            where,
            orderBy: sortBy ? { [sortBy]: sortDir ?? 'asc' } : undefined,
            skip,
            take
        });

        const fieldCount = await this.prisma.field.count({ where });

            console.log(`fieldsService -> findAll -> found ${fields.length} fields`);

        return { fields, fieldCount };
    }

    findOne(id: number) {
        return this.prisma
            .$queryRaw`SELECT id, name, product_name, farmer_id, region, familiarity,
            familiarity_desc, latitude, longitude, ST_AsGeoJSON(polygon) AS polygon, latest_satelite_metric,
            category, status, status_date, delay_date, created_date
             FROM "Field" WHERE "Field".id = ${id};`;
    }

    findByFilter(filter: FilterFieldDto) {
        return this.prisma.field.findMany({ where: filter });
    }

    async update(id: number, updateFieldDto: UpdateFieldDto) {
        // updates will not work for polygons
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
        return "ok";
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
}

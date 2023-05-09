import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
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
    return await this.prisma // queryRaw is used since polygon is not supported by Prisma
      .$queryRaw(Prisma.sql`INSERT INTO "Field" (name, product_name, farmer_id, region, familiarity,
            familiarity_desc, latitude, longitude, polygon, latest_satelite_metric,
            category, status, status_date, delay_date, created_date)
             VALUES (${createFieldDto.name}, CAST(${createFieldDto.product_name} AS "Product"), ${createFieldDto.farmer_id}, CAST(${createFieldDto.region} AS "Region"),
                     CAST(${createFieldDto.familiarity} AS "Familiarity"), ${createFieldDto.familiarity_desc}, ${createFieldDto.latitude}, ${createFieldDto.longitude}, CAST(ST_GeomFromText(${createFieldDto.polygon}) AS polygon),
                     ${createFieldDto.latest_satelite_metric}, CAST(${createFieldDto.category} AS "FieldCategory"), CAST(${createFieldDto.status} AS "FieldStatus"),
                     CAST(${createFieldDto.status_date} AS date), CAST(${createFieldDto.delay_date} AS date), CAST(${createFieldDto.created_date} AS date))
             RETURNING id, name, product_name, farmer_id, region, familiarity,
            familiarity_desc, latitude, longitude, CAST(polygon AS varchar), latest_satelite_metric,
            category, status, status_date, delay_date, created_date;`);
  }

  findAll(limit: number, offset: number) {
    return this.prisma
      .$queryRaw`SELECT id, name, product_name, farmer_id, region, familiarity,
            familiarity_desc, latitude, longitude, CAST(polygon AS varchar) AS polygon, latest_satelite_metric,
            category, status, status_date, delay_date, created_date
             FROM "Field" LIMIT ${+limit} OFFSET ${+offset};`;
  }

  findOne(id: number) {
    return this.prisma
      .$queryRaw`SELECT id, name, product_name, farmer_id, region, familiarity,
            familiarity_desc, latitude, longitude, CAST(polygon AS varchar) AS polygon, latest_satelite_metric,
            category, status, status_date, delay_date, created_date
             FROM "Field" WHERE "Field".id = ${id};`;
  }

  findByFilter(updateFilter: object) {
    // TODO: add the functionality to filter by polygon (currently impossible)
    return this.prisma.field.findMany({ where: updateFilter });
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

  remove(id: number) {
    return this.prisma.field.delete({ where: { id } });
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
}

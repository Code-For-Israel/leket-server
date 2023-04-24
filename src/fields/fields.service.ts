import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoriesService } from '../histories/histories.service';
import { Field } from '@prisma/client';

@Injectable()
export class FieldsService {
  constructor(
    private prisma: PrismaService,
    private historiesService: HistoriesService,
  ) {}
  create(createFieldDto: CreateFieldDto) {
    return this.prisma.field.create({ data: createFieldDto });
  }

  findAll(limit: number, offset: number) {
    return this.prisma.field.findMany({ take: +limit, skip: +offset });
  }

  findOne(id: number) {
    return this.prisma.field.findUnique({ where: { id } });
  }

  findByFilter(updateFilter: object) {
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

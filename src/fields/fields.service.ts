import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FieldsService {
  constructor(private prisma: PrismaService) {}
  create(createFieldDto: CreateFieldDto) {
    return this.prisma.field.create({ data: createFieldDto });
  }

  findAll(limit: number, offset: number) {
    return this.prisma.field.findMany({ take: +limit, skip: +offset });
  }

  findOne(id: number) {
    return this.prisma.field.findUnique({ where: { id } });
  }

  update(id: number, updateFieldDto: UpdateFieldDto) {
    return this.prisma.field.update({ where: { id }, data: updateFieldDto });
  }

  remove(id: number) {
    return this.prisma.field.delete({ where: { id } });
  }
}

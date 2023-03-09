import { Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FieldsService {
  constructor(private prisma: PrismaService) {}
  create(createFieldDto: CreateFieldDto) {
    return 'This action adds a new field';
  }

  findAll() {
    return this.prisma.field.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} field`;
  }

  update(id: number, updateFieldDto: UpdateFieldDto) {
    return `This action updates a #${id} field`;
  }

  remove(id: number) {
    return `This action removes a #${id} field`;
  }
}

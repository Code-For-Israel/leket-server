import { Injectable } from '@nestjs/common';
import { CreateSateliteDto } from './dto/create-satelite.dto';
import { UpdateSateliteDto } from './dto/update-satelite.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SatelitesService {
  constructor(private prisma: PrismaService) {}
  create(createSateliteDto: CreateSateliteDto) {
    return this.prisma.satelite.create({ data: createSateliteDto });
  }

  findAll(limit: number, offset: number) {
    return this.prisma.satelite.findMany({ take: +limit, skip: +offset });
  }

  findOne(field_id: number, date: Date) {
    return this.prisma.satelite.findUnique({
      where: { field_id_date: { field_id, date } },
    });
  }

  update(field_id: number, date: Date, updateSateliteDto: UpdateSateliteDto) {
    return this.prisma.satelite.update({
      where: { field_id_date: { field_id, date } },
      data: updateSateliteDto,
    });
  }

  remove(field_id: number, date: Date) {
    return this.prisma.satelite.delete({
      where: { field_id_date: { field_id, date } },
    });
  }
}

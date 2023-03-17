import { Injectable } from '@nestjs/common';
import { CreateSatelliteDto } from './dto/create-satellite.dto';
import { UpdateSatelliteDto } from './dto/update-satellite.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SatellitesService {
  constructor(private prisma: PrismaService) {}
  create(createSateliteDto: CreateSatelliteDto) {
    return this.prisma.satellite.create({ data: createSateliteDto });
  }

  findAll(limit: number, offset: number) {
    return this.prisma.satellite.findMany({ take: +limit, skip: +offset });
  }

  findOne(field_id: number, date: Date) {
    return this.prisma.satellite.findUnique({
      where: { field_id_date: { field_id, date } },
    });
  }

  update(field_id: number, date: Date, updateSateliteDto: UpdateSatelliteDto) {
    return this.prisma.satellite.update({
      where: { field_id_date: { field_id, date } },
      data: updateSateliteDto,
    });
  }

  remove(field_id: number, date: Date) {
    return this.prisma.satellite.delete({
      where: { field_id_date: { field_id, date } },
    });
  }
}

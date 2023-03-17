import { Injectable } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  create(createMissionDto: CreateMissionDto) {
    return this.prisma.mission.create({ data: createMissionDto });
  }

  findAll(limit: number, offset: number) {
    return this.prisma.mission.findMany({ take: +limit, skip: +offset });
  }

  findOne(id: number) {
    return this.prisma.mission.findUnique({ where: { id } });
  }

  update(id: number, updateMissionDto: UpdateMissionDto) {
    return this.prisma.mission.update({
      where: { id },
      data: updateMissionDto,
    });
  }

  remove(id: number) {
    return this.prisma.mission.delete({ where: { id } });
  }
}

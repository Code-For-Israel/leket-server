import { Injectable, Logger } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class HistoriesService {
  private readonly limit = 20;
  private readonly logger: Logger = new Logger(HistoriesService.name);
  constructor(private prisma: PrismaService) {}
  create(
    createHistoryDto: CreateHistoryDto,
    prismaClient: PrismaClient = this.prisma,
  ) {
    return prismaClient.history.create({ data: createHistoryDto });
  }

  async findRecent(fieldId: number) {
    const histories = await this.prisma.history.findMany({
      where: { field_id: fieldId },
      take: this.limit,
    });
    this.logger.log(
      'Found recent histories for field id ' + fieldId,
      histories,
    );
    return histories;
  }

  findOne(id: number) {
    return this.prisma.history.findUnique({ where: { id } });
  }

  findByFilter(updateFilter: object) {
    return this.prisma.history.findMany({ where: updateFilter });
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return this.prisma.history.update({
      where: { id },
      data: updateHistoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.history.delete({ where: { id } });
  }

  remove_by_field_id(field_id: number) {
    return this.prisma.history.deleteMany({ where: { field_id } });
  }
}

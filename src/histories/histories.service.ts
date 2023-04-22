import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoriesService {
  constructor(private prisma: PrismaService) {}
  create(createHistoryDto: CreateHistoryDto) {
    return this.prisma.history.create({ data: createHistoryDto });
  }

  findAll(limit: number, offset: number) {
    return this.prisma.history.findMany({ take: +limit, skip: +offset });
  }

  findOne(id: number) {
    return this.prisma.history.findUnique({ where: { id } });
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
}

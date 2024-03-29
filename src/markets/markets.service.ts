import { Injectable } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketsService {
  constructor(private prisma: PrismaService) {}
  create(createMarketDto: CreateMarketDto) {
    return this.prisma.market.create({ data: createMarketDto });
  }

  findAll(limit: number, offset: number) {
    return this.prisma.market.findMany({ take: +limit, skip: +offset });
  }

  findOne(id: number) {
    return this.prisma.market.findUnique({ where: { id } });
  }

  update(id: number, updateMarketDto: UpdateMarketDto) {
    return this.prisma.market.update({ where: { id }, data: updateMarketDto });
  }

  remove(id: number) {
    return this.prisma.market.delete({ where: { id } });
  }
}

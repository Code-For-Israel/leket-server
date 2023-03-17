import { Injectable } from '@nestjs/common';
import { CreateAttractivenessDto } from './dto/create-attractiveness.dto';
import { UpdateAttractivenessDto } from './dto/update-attractiveness.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttractivenessService {
  constructor(private prisma: PrismaService) {}
  create(createAttractivenessDto: CreateAttractivenessDto) {
    return this.prisma.attractiveness.create({ data: createAttractivenessDto });
  }

  findAll(limit: number, offset: number) {
    return this.prisma.attractiveness.findMany({ take: +limit, skip: +offset });
  }

  findOne(id: number) {
    return this.prisma.attractiveness.findUnique({ where: { id } });
  }

  update(id: number, updateAttractivenessDto: UpdateAttractivenessDto) {
    return this.prisma.attractiveness.update({
      where: { id },
      data: updateAttractivenessDto,
    });
  }

  remove(id: number) {
    return this.prisma.attractiveness.delete({ where: { id } });
  }
}

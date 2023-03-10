import { Injectable } from '@nestjs/common';
import { CreateAttractivenessDto } from './dto/create-attractiveness.dto';
import { UpdateAttractivenessDto } from './dto/update-attractiveness.dto';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AttractivenessesService {
  constructor(private prisma: PrismaService) {}
  create(createAttractivenessDto: CreateAttractivenessDto) {
    return this.prisma.attractiveness.create({ data: createAttractivenessDto });
  }

  findAll() {
    return `This action returns all attractivenesses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attractiveness`;
  }

  update(id: number, updateAttractivenessDto: UpdateAttractivenessDto) {
    return `This action updates a #${id} attractiveness`;
  }

  remove(id: number) {
    return `This action removes a #${id} attractiveness`;
  }
}

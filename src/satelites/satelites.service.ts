import { Injectable } from '@nestjs/common';
import { CreateSateliteDto } from './dto/create-satelite.dto';
import { UpdateSateliteDto } from './dto/update-satelite.dto';

@Injectable()
export class SatelitesService {
  create(createSateliteDto: CreateSateliteDto) {
    return 'This action adds a new satelite';
  }

  findAll() {
    return `This action returns all satelites`;
  }

  findOne(id: number) {
    return `This action returns a #${id} satelite`;
  }

  update(id: number, updateSateliteDto: UpdateSateliteDto) {
    return `This action updates a #${id} satelite`;
  }

  remove(id: number) {
    return `This action removes a #${id} satelite`;
  }
}

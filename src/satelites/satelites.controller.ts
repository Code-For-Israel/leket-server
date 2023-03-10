import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SatelitesService } from './satelites.service';
import { CreateSateliteDto } from './dto/create-satelite.dto';
import { UpdateSateliteDto } from './dto/update-satelite.dto';

@Controller('satelites')
export class SatelitesController {
  constructor(private readonly satelitesService: SatelitesService) {}

  @Post()
  create(@Body() createSateliteDto: CreateSateliteDto) {
    return this.satelitesService.create(createSateliteDto);
  }

  @Get()
  findAll() {
    return this.satelitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.satelitesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSateliteDto: UpdateSateliteDto) {
    return this.satelitesService.update(+id, updateSateliteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.satelitesService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SatelitesService } from './satelites.service';
import { CreateSateliteDto } from './dto/create-satelite.dto';
import { UpdateSateliteDto } from './dto/update-satelite.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SateliteEntity } from './entities/satelite.entity';

@Controller('satelites')
@ApiTags('Satellites')
export class SatelitesController {
  constructor(private readonly satelitesService: SatelitesService) {}

  @Post()
  @ApiCreatedResponse({ type: SateliteEntity })
  create(@Body() createSateliteDto: CreateSateliteDto) {
    return this.satelitesService.create(createSateliteDto);
  }

  @Get()
  @ApiOkResponse({ type: SateliteEntity, isArray: true })
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.satelitesService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOkResponse({ type: SateliteEntity })
  findOne(@Param('field_id') id: string, @Param('date') date: Date) {
    return this.satelitesService.findOne(+id, date);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('date') date: Date,
    @Body() updateSateliteDto: UpdateSateliteDto,
  ) {
    return this.satelitesService.update(+id, date, updateSateliteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.satelitesService.remove(+id, date);
  }
}

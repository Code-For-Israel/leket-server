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
import { SatellitesService } from './satellites.service';
import { CreateSatelliteDto } from './dto/create-satellite.dto';
import { UpdateSatelliteDto } from './dto/update-satellite.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SatelliteEntity } from './entities/satellite.entity';

@Controller('satellites')
@ApiTags('Satellites')
export class SatellitesController {
  constructor(private readonly satellitesService: SatellitesService) {}

  @Post()
  @ApiCreatedResponse({ type: SatelliteEntity })
  create(@Body() createSatelliteDto: CreateSatelliteDto) {
    return this.satellitesService.create(createSatelliteDto);
  }

  @Get()
  @ApiOkResponse({ type: SatelliteEntity, isArray: true })
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.satellitesService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOkResponse({ type: SatelliteEntity })
  findOne(@Param('field_id') id: string, @Param('date') date: Date) {
    return this.satellitesService.findOne(+id, date);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('date') date: Date,
    @Body() updateSatelliteDto: UpdateSatelliteDto,
  ) {
    return this.satellitesService.update(+id, date, updateSatelliteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.satellitesService.remove(+id, date);
  }
}

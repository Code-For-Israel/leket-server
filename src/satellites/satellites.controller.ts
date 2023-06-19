import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SatellitesService } from './satellites.service';
import { CreateSatelliteDto } from './dto/create-satellite.dto';
import { UpdateSatelliteDto } from './dto/update-satellite.dto';
import {ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import { SatelliteEntity } from './entities/satellite.entity';

@Controller('satellites')
@ApiBearerAuth()
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
  findOne(@Param('field_id') id: number) {
    return this.satellitesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateSatelliteDto: UpdateSatelliteDto,
  ) {
    try {
      return this.satellitesService.update(+id, updateSatelliteDto);
    } catch (e) {
      console.error('Error updating satellite', e);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.satellitesService.remove(+id);
  }
}

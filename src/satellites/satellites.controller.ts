import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SatellitesService } from './satellites.service';
import { CreateSatelliteDto } from './dto/create-satellite.dto';
import { UpdateSatelliteDto } from './dto/update-satellite.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SatelliteEntity } from './entities/satellite.entity';
import { FieldEntity } from '../fields/entities/field.entity';

@Controller('satellites')
@ApiBearerAuth()
@ApiTags('Satellites')
export class SatellitesController {
  constructor(
    private readonly satellitesService: SatellitesService,
    private logger: Logger = new Logger(SatellitesController.name),
  ) {}

  @Post('create')
  @ApiCreatedResponse({ type: SatelliteEntity })
  create(@Body() createSatelliteDto: CreateSatelliteDto) {
    return this.satellitesService.create(createSatelliteDto);
  }

  @Post('create-many')
  @ApiBody({ type: CreateSatelliteDto, isArray: true })
  createMany(@Body() createSatelliteDtoArray: CreateSatelliteDto[]) {
    return this.satellitesService.createMany(createSatelliteDtoArray);
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
      this.logger.error('Error updating satellite', e);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.satellitesService.remove(+id);
  }
}

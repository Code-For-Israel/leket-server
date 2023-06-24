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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HistoriesService } from './histories.service';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@ApiBearerAuth()
@Controller('histories')
@ApiTags('Histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Post()
  @ApiCreatedResponse({ type: History })
  create(@Body() createMissionDto: CreateHistoryDto) {
    return this.historiesService.create(createMissionDto);
  }

  @Get('get-recent-20-histories-per-field/:fieldId')
  @ApiOkResponse({ type: History, isArray: true })
  findRecent(@Param('fieldId') fieldId: number) {
    return this.historiesService.findRecent(+fieldId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissionDto: UpdateHistoryDto) {
    return this.historiesService.update(+id, updateMissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historiesService.remove(+id);
  }
}

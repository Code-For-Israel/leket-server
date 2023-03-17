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
import { MarketsService } from './markets.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MarketEntity } from './entities/market.entity';

@Controller('markets')
@ApiTags('Market')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Post()
  @ApiCreatedResponse({ type: MarketEntity })
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketsService.create(createMarketDto);
  }

  @Get()
  @ApiOkResponse({ type: MarketEntity, isArray: true })
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.marketsService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiCreatedResponse({ type: MarketEntity })
  findOne(@Param('id') id: string) {
    return this.marketsService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: MarketEntity })
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketsService.update(+id, updateMarketDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: MarketEntity })
  remove(@Param('id') id: string) {
    return this.marketsService.remove(+id);
  }
}

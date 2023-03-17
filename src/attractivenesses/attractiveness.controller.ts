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
import { AttractivenessService } from './attractiveness.service';
import { CreateAttractivenessDto } from './dto/create-attractiveness.dto';
import { UpdateAttractivenessDto } from './dto/update-attractiveness.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AttractivenessEntity } from './entities/attractiveness.entity';

@Controller('attractiveness')
@ApiTags('Attractiveness')
export class AttractivenessController {
  constructor(private readonly attractivenessService: AttractivenessService) {}

  @Post()
  @ApiCreatedResponse({ type: AttractivenessEntity })
  create(@Body() createAttractivenessDto: CreateAttractivenessDto) {
    return this.attractivenessService.create(createAttractivenessDto);
  }

  @Get()
  @ApiOkResponse({ type: AttractivenessEntity, isArray: true })
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.attractivenessService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOkResponse({ type: AttractivenessEntity })
  findOne(@Param('id') id: string) {
    return this.attractivenessService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: AttractivenessEntity })
  update(
    @Param('id') id: string,
    @Body() updateAttractivenessDto: UpdateAttractivenessDto,
  ) {
    return this.attractivenessService.update(+id, updateAttractivenessDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AttractivenessEntity })
  remove(@Param('id') id: string) {
    return this.attractivenessService.remove(+id);
  }
}

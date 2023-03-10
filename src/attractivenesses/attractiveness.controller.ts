import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttractivenessService } from './attractiveness.service';
import { CreateAttractivenessDto } from './dto/create-attractiveness.dto';
import { UpdateAttractivenessDto } from './dto/update-attractiveness.dto';

@Controller('attractiveness')
export class AttractivenessController {
  constructor(private readonly attractivenessService: AttractivenessService) {}

  @Post()
  create(@Body() createAttractivenessDto: CreateAttractivenessDto) {
    return this.attractivenessService.create(createAttractivenessDto);
  }

  @Get()
  findAll() {
    return this.attractivenessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attractivenessService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttractivenessDto: UpdateAttractivenessDto,
  ) {
    return this.attractivenessService.update(+id, updateAttractivenessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attractivenessService.remove(+id);
  }
}

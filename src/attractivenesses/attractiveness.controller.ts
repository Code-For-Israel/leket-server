import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttractivenessesService } from './attractivenesses.service';
import { CreateAttractivenessDto } from './dto/create-attractiveness.dto';
import { UpdateAttractivenessDto } from './dto/update-attractiveness.dto';

@Controller('attractivenesses')
export class AttractivenessesController {
  constructor(
    private readonly attractivenessesService: AttractivenessesService,
  ) {}

  @Post()
  create(@Body() createAttractivenessDto: CreateAttractivenessDto) {
    return this.attractivenessesService.create(createAttractivenessDto);
  }

  @Get()
  findAll() {
    return this.attractivenessesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attractivenessesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttractivenessDto: UpdateAttractivenessDto,
  ) {
    return this.attractivenessesService.update(+id, updateAttractivenessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attractivenessesService.remove(+id);
  }
}

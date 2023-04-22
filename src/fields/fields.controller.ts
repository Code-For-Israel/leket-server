import {
  Header,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FieldEntity } from './entities/field.entity';

@Controller('fields')
@ApiTags('Fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @ApiCreatedResponse({ type: FieldEntity })
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(createFieldDto);
  }

  @Get()
  @Header('Access-Control-Allow-Origin', '*')
  @Header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  @ApiOkResponse({ type: FieldEntity, isArray: true })
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.fieldsService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOkResponse({ type: FieldEntity })
  findOne(@Param('id') id: string) {
    return this.fieldsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FieldEntity })
  update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldsService.update(+id, updateFieldDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: FieldEntity })
  remove(@Param('id') id: string) {
    return this.fieldsService.remove(+id);
  }
}

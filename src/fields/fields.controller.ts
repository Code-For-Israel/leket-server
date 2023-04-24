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
import { FilterFieldDto } from './dto/filter-field.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FieldEntity } from './entities/field.entity';

@Controller('fields')
@ApiTags('Fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @ApiCreatedResponse({ type: FieldEntity })
  async create(@Body() createFieldDto: CreateFieldDto) {
    try {
      const fieldCreated = await this.fieldsService.create(createFieldDto);
      console.log('Field created', fieldCreated);
    } catch (error) {
      console.error('Error creating field', error);
    }
  }

  @Get()
  @Header('Access-Control-Allow-Origin', '*')
  @Header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  @ApiOkResponse({ type: FieldEntity, isArray: true })
  async findAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    try {
      const findAllRes = await this.fieldsService.findAll(limit, offset);
      console.log('All fields', findAllRes);
    } catch (error) {
      console.error('Error finding all fields', error);
    }
  }

  @Get(':id')
  @ApiOkResponse({ type: FieldEntity })
  findOne(@Param('id') id: string) {
    try {
      const fundOneRes = this.fieldsService.findOne(+id);
      console.log('Field found by id', fundOneRes);
    } catch (error) {
      console.error('Error finding field by id', error);
    }
  }

  @Post('/update')
  @ApiOkResponse({ type: FieldEntity })
  findByFilter(@Body() filter: FilterFieldDto) {
    try {
      return this.fieldsService.findByFilter(filter);
    } catch (error) {
      console.log('Error finding field by filter', error);
    }
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

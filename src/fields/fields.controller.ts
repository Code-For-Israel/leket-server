import {
  Header,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
    return this.fieldsService.create(createFieldDto);
  }

  // @Get()
  // @Header('Access-Control-Allow-Origin', '*')
  // @Header(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept',
  // )
  // @ApiOkResponse({ type: FieldEntity, isArray: true })
  // async findAll(
  //     @Query('limit') limit: number,
  //     @Query('offset') offset: number,
  // ) {
  //     try {
  //         const findAllRes = await this.fieldsService.findAll(limit, offset);
  //         console.log('All fields', findAllRes);
  //         return findAllRes;
  //     } catch (error) {
  //         console.error('Error finding all fields', error);
  //     }
  // }

  @Post('get')
  @Header('Access-Control-Allow-Origin', '*')
  @Header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  @ApiOkResponse({ type: FieldEntity, isArray: true })
  async findAll(@Body() filters: object) {
    // async findAll(
    //     @Query('filters') filters: object,
    //     @Query('page') page: number,
    //     @Query('pageSize') pageSize: number,
    // ) {
    try {
      const { fields, fieldCount } = await this.fieldsService.findAll(filters);
      return { fields, fieldCount };
    } catch (error) {
      console.error('Error finding all fields', error);
    }
  }

  @Get(':id')
  @ApiOkResponse({ type: FieldEntity })
  async findOne(@Param('id') id: string) {
    try {
      const fundOneRes = await this.fieldsService.findOne(+id);
      console.log('Field found by id', fundOneRes);
      return fundOneRes;
    } catch (error) {
      console.error('Error finding field by id', error);
    }
  }

  @Post('/filter')
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
  async remove(@Param('id') id: string) {
    const result = await this.fieldsService.remove(+id);
    return { status: result };
  }
}

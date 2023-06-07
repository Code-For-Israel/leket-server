import {
  Header,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
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

  @Post('get')
  @Header('Access-Control-Allow-Origin', '*')
  @Header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  @ApiOkResponse({ type: FieldEntity, isArray: true })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByFilter(@Body() filters: FilterFieldDto) {
    const { fieldsWithGeo, fieldCount } =
      await this.fieldsService.findAllByFilter(filters);
    return { fields: fieldsWithGeo, fieldCount };
  }

  @Get(':id')
  @ApiOkResponse({ type: FieldEntity })
  async findOne(@Param('id') id: string) {
    try {
      const findOneRes = await this.fieldsService.findOne(+id);
      if (!findOneRes) {
        console.log('Field found by id', findOneRes);
      } else {
        console.log('Field not found by id: ' + id);
      }
      return findOneRes;
    } catch (error) {
      console.error('Error finding field by id', error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOkResponse({ type: FieldEntity })
  async updateOne(
    @Param('id') id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    return this.fieldsService.updateOne(+id, updateFieldDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: FieldEntity })
  async remove(@Param('id') id: string) {
    const result = await this.fieldsService.remove(+id);
    return { status: result };
  }
}

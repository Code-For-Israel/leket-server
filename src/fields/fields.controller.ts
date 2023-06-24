import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { FilterFieldDto } from './dto/filter-field.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FieldEntity } from './entities/field.entity';
import { FilterFieldByPointDto } from './dto/filter-field-point.dto';

@ApiBearerAuth()
@Controller('fields')
@ApiTags('Fields')
export class FieldsController {
  constructor(
    private readonly fieldsService: FieldsService,
    private readonly logger: Logger = new Logger(FieldsController.name),
  ) {}

  @Post('create')
  @ApiCreatedResponse({ type: FieldEntity })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      enableDebugMessages: true,
    }),
  )
  async create(@Body() createFieldDto: CreateFieldDto) {
    try {
      return this.fieldsService.create(createFieldDto);
    } catch (e) {
      this.logger.error('Error creating field', e);
      throw e;
    }
  }

  @Post('get-field-by-filter')
  @ApiOkResponse({ type: FieldEntity, isArray: true })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllByFilter(@Body() filters: FilterFieldDto) {
    const { fieldsWithGeo, fieldCount } =
      await this.fieldsService.findAllByFilter(filters);
    return { fields: fieldsWithGeo, fieldCount };
  }

  @Get('get-field/:id')
  @ApiOkResponse({ type: FieldEntity })
  async findOne(@Param('id') id: string) {
    try {
      const findOneRes = await this.fieldsService.findOne(+id);
      if (findOneRes) {
        console.log('Field found: ', findOneRes);
      } else {
        console.log('Field not found by id: ' + id);
      }
      return findOneRes;
    } catch (error) {
      this.logger.error('Error finding field by id', error);
      throw error;
    }
  }

  @Patch('update-field/:id')
  @ApiOkResponse({ type: FieldEntity })
  async updateOne(
    @Param('id') id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    // TODO: add filter validation
    return this.fieldsService.updateOne(+id, updateFieldDto);
  }

  @Delete('delete-field/:id')
  @ApiOkResponse({ type: FieldEntity })
  async remove(@Param('id') id: string) {
    const result = await this.fieldsService.remove(+id);
    return { status: result };
  }

  @Post('get-field-by-point')
  @ApiOkResponse({ type: FieldEntity })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getFieldThatIntersectsWithPoint(@Body() body: FilterFieldByPointDto) {
    const { point } = body;
    try {
      return await this.fieldsService.getFieldByPoint(point);
    } catch (e) {
      this.logger.error('Error finding field by point', e);
      throw e;
    }
  }
}

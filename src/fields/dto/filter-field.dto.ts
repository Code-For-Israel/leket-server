import { PartialType } from '@nestjs/swagger';
import { CreateFieldDto } from './create-field.dto';

export class FilterFieldDto extends PartialType(CreateFieldDto) {}

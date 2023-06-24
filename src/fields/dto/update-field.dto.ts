import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFieldDto } from './create-field.dto';
import { IsOptional } from 'class-validator';

export class UpdateFieldDto extends PartialType(CreateFieldDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  removeGeo?: boolean;
}

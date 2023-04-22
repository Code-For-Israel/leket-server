import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSatelliteDto {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  field_id: number;
  @ApiProperty()
  statistics: Prisma.JsonValue;
  @ApiProperty()
  like: boolean;
}

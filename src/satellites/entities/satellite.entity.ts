import { Prisma, Satellite } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SatelliteEntity implements Satellite {
  @ApiProperty()
  id: number;
  @ApiProperty()
  field_id: number;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  statistics: Prisma.JsonValue;
  @ApiProperty()
  like: boolean;
}

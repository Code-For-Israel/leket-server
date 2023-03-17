import { Prisma, Satelite } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SateliteEntity implements Satelite {
  @ApiProperty()
  field_id: number;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  statistics: Prisma.JsonValue;
  @ApiProperty()
  like: boolean;
}

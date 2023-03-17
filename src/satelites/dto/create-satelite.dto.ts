import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSateliteDto {
  @ApiProperty()
  field_id: number;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  statistics: Prisma.JsonValue;
  @ApiProperty()
  like: boolean;
}

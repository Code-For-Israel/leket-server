// meant for swagger response types

import {
  Familiarity,
  Field,
  FieldStatus,
  Prisma,
  Region,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FieldEntity implements Field {
  @ApiProperty()
  category: string;

  @ApiProperty()
  created_date: Date;

  @ApiProperty()
  delay_date: Date;

  @ApiProperty()
  familiarity: Familiarity;

  @ApiProperty()
  familiarity_desc: string;

  @ApiProperty()
  farmer_id: string | null;

  @ApiProperty()
  id: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  polygon: Prisma.JsonValue;

  @ApiProperty()
  product_name: string | null;

  @ApiProperty()
  region: Region;

  @ApiProperty()
  status: FieldStatus;

  @ApiProperty()
  status_date: Date;
}

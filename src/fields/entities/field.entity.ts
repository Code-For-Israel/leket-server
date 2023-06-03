// meant for swagger response types
import {
  Familiarity,
  Field,
  FieldStatus,
  Region,
  Product,
  FieldCategory,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FieldEntity implements Field {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  product_name: Product;

  @ApiProperty()
  familiarity: Familiarity;

  @ApiProperty()
  familiarity_desc: string | null;

  @ApiProperty()
  farmer_id: string | null;

  @ApiProperty()
  region: Region;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  sentinel_id: string;

  @ApiProperty()
  latest_satelite_metric: number;

  @ApiProperty()
  latest_attractiveness_metric: number;

  @ApiProperty()
  category: FieldCategory | null;

  @ApiProperty()
  status: FieldStatus;

  @ApiProperty()
  status_date: Date | null;

  @ApiProperty()
  delay_date: Date | null;

  @ApiProperty()
  created_date: Date;
}

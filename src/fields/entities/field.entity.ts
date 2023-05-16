// meant for swagger response types
import { Polygon } from 'geojson';
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
  familiarity_desc: string;

  @ApiProperty()
  farmer_id: string | null;

  @ApiProperty()
  region: Region;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  polygon: Polygon;

  @ApiProperty()
  latest_satelite_metric: number;

  @ApiProperty()
  category: FieldCategory;

  @ApiProperty()
  status: FieldStatus;

  @ApiProperty()
  status_date: Date;

  @ApiProperty()
  delay_date: Date;

  @ApiProperty()
  created_date: Date;
}

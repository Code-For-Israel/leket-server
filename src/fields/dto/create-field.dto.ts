import { ApiProperty } from '@nestjs/swagger';
import { Polygon, Point } from 'geojson';
import {
  Familiarity,
  FieldCategory,
  FieldStatus,
  Product,
  Region,
} from '@prisma/client';
export class CreateFieldDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  product_name?: Product;

  @ApiProperty({ required: false })
  farmer_id?: string;

  @ApiProperty()
  region: Region;

  @ApiProperty()
  familiarity: Familiarity;

  @ApiProperty()
  familiarity_desc: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  polygon?: Polygon;

  @ApiProperty()
  point?: Point;

  @ApiProperty({ required: false })
  latest_satelite_metric?: number;

  @ApiProperty({ required: false })
  latest_attractiveness_metric?: number;

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

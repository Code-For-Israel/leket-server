import { ApiProperty } from '@nestjs/swagger';
import { Polygon, Point } from 'geojson';
import {
  Familiarity,
  FieldCategory,
  FieldStatus,
  Product,
  Region,
} from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFieldDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsEnum(Product)
  product_name?: Product;

  @ApiProperty({ required: false })
  @IsOptional()
  farmer_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Region)
  region: Region;

  @ApiProperty({ required: false })
  @IsOptional()
  sentinel_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Familiarity)
  familiarity: Familiarity;

  @ApiProperty()
  @IsOptional()
  familiarity_desc: string;

  @ApiProperty()
  @Type(() => Polygon)
  @IsOptional()
  polygon: Polygon;

  @ApiProperty()
  @Type(() => Point)
  @IsOptional()
  point: Point;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  latest_satellite_metric?: number;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  latest_satellite_date: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  latest_attractiveness_metric?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(FieldCategory)
  category: FieldCategory;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(FieldStatus)
  status: FieldStatus;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  status_date: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  delay_date: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  created_date: Date;
}

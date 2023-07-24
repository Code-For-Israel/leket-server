import { ApiProperty } from '@nestjs/swagger';
import { Polygon } from 'geojson';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  FilterAttractivenessRange,
  FilterDateRange,
  FilterNdviRange,
} from '../field-types';
import {
  Familiarity,
  FieldCategory,
  FieldStatus,
  Product,
  Region,
} from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterFieldDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  prefixNameField: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  prefixNameAgricultural: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Product, { each: true })
  products: Product[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(Region, { each: true })
  regions: Region[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(Familiarity, { each: true })
  familiarities: Familiarity[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(FieldStatus, { each: true })
  careStatuses: FieldStatus[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(FieldCategory, { each: true })
  fieldCategories: FieldCategory[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortBy: string;

  @ApiProperty()
  @IsOptional()
  sortDir: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Min(0)
  page: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Max(100)
  pageSize: number;

  @ApiProperty()
  @IsOptional()
  filterNdviRange: FilterNdviRange;

  @ApiProperty()
  @IsOptional()
  filterAttractivenessRange: FilterAttractivenessRange;

  @ApiProperty()
  @IsOptional()
  filterDateRange: FilterDateRange;

  @ApiProperty()
  @IsOptional()
  @Type(() => Polygon)
  polygonFilter: Polygon;
}

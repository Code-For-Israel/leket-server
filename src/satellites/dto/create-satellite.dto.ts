import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateSatelliteDto {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNumber()
  field_id: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  ndvi_max?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  ndvi_min?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  ndvi_std?: number;

  @ApiProperty()
  @IsNumber()
  ndvi_mean: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  ndvi_median?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  like?: boolean;
}

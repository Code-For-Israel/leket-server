import { Satellite } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SatelliteEntity implements Satellite {
  @ApiProperty()
  id: number;

  @ApiProperty()
  field_id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  ndvi_max: number;

  @ApiProperty()
  ndvi_min: number;

  @ApiProperty()
  ndvi_std: number;

  @ApiProperty()
  ndvi_mean: number;

  @ApiProperty()
  ndvi_median: number;

  @ApiProperty()
  like: boolean;
}

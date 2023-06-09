import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'geojson';
import { IsNotEmpty } from 'class-validator';

import { Type } from 'class-transformer';

export class FilterFieldByPointDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Point)
  point: Point;
}

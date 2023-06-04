import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFieldDto } from './create-field.dto';
import { Polygon } from 'geojson';

export class FilterFieldDto extends PartialType(CreateFieldDto) {
  name: string;
  products: string[];
  regions: string[];
  careStatuses: string[];
  sortBy: string;
  sortDir: string;
  page: number;
  pageSize: number;
  optionMoreFilters: object;

  @ApiProperty()
  polygonFilter: Polygon;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateAttractivenessDto {
  @ApiProperty()
  field_id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  mission_score: number;

  @ApiProperty()
  market_score: number;

  @ApiProperty()
  satellite_score: number;

  @ApiProperty()
  average_score: number;

  @ApiProperty()
  like: boolean;
}

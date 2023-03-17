import { ApiProperty } from '@nestjs/swagger';
import { Attractiveness } from '@prisma/client';

export class AttractivenessEntity implements Attractiveness {
  @ApiProperty()
  field_id: number;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  mission_score: number;
  @ApiProperty()
  market_score: number;
  @ApiProperty()
  satelite_score: number;
  @ApiProperty()
  average_score: number;
  @ApiProperty()
  like: boolean;
  @ApiProperty()
  id: number;
}

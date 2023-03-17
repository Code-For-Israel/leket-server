import { Mission, Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MissionEntity implements Mission {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  field_id: number;
  @ApiProperty()
  product_name: Product;
  @ApiProperty()
  amount_kg: number;
  @ApiProperty()
  was_ripe: string;
  @ApiProperty()
  was_picked: boolean;
  @ApiProperty()
  not_picked_desc: string;
  @ApiProperty()
  id: number;
}

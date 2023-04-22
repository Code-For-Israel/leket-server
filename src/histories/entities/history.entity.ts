import { Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class History {
  @ApiProperty()
  id: number;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  field_id: number;
  @ApiProperty()
  product_name: Product;
  @ApiProperty()
  farmer_id: string;
}

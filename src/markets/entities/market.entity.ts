import { ApiProperty } from '@nestjs/swagger';
import { Market, Product } from '@prisma/client';

export class MarketEntity implements Market {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  product_name: Product;
  @ApiProperty()
  price: number;
  @ApiProperty()
  id: number;
}

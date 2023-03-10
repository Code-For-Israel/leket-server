import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';

export class CreateMarketDto {
  @ApiProperty()
  date: Date;

  @ApiProperty()
  product_name: Product;

  @ApiProperty()
  price: number;
}

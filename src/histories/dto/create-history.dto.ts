import { Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHistoryDto {
  @ApiProperty({ required: false })
  date?: Date;
  @ApiProperty()
  field_id: number;
  @ApiProperty()
  product_name: Product;
  @ApiProperty()
  farmer_id: string;
}

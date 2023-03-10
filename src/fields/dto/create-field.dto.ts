import { ApiProperty } from '@nestjs/swagger';
import { Familiarity, FieldStatus, Product, Region } from '@prisma/client';
export class CreateFieldDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  product_name?: Product;

  @ApiProperty({ required: false })
  farmer_id?: string;

  @ApiProperty()
  region: Region;

  @ApiProperty()
  familiarity: Familiarity;

  @ApiProperty()
  familiarity_desc: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  polygon: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  status: FieldStatus;

  @ApiProperty()
  status_date: Date;

  @ApiProperty()
  delay_date: Date;

  @ApiProperty()
  created_date: Date;
}

import { PartialType } from '@nestjs/swagger';
import { CreateAttractivenessDto } from './create-attractiveness.dto';

export class UpdateAttractivenessDto extends PartialType(
  CreateAttractivenessDto,
) {}

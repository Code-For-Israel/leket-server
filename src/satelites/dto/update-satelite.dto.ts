import { PartialType } from '@nestjs/swagger';
import { CreateSateliteDto } from './create-satelite.dto';

export class UpdateSateliteDto extends PartialType(CreateSateliteDto) {}

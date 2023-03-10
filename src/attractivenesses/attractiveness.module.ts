import { Module } from '@nestjs/common';
import { AttractivenessesService } from './attractivenesses.service';
import { AttractivenessesController } from './attractivenesses.controller';

@Module({
  controllers: [AttractivenessesController],
  providers: [AttractivenessesService],
})
export class AttractivenessesModule {}

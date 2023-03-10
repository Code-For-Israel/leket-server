import { Module } from '@nestjs/common';
import { SatelitesService } from './satelites.service';
import { SatelitesController } from './satelites.controller';

@Module({
  controllers: [SatelitesController],
  providers: [SatelitesService],
})
export class SatelitesModule {}

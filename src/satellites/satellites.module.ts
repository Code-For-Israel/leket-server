import { Module } from '@nestjs/common';
import { SatellitesService } from './satellites.service';
import { SatelitesController } from './satellites.controller';

@Module({
  controllers: [SatelitesController],
  providers: [SatellitesService],
})
export class SatellitesModule {}

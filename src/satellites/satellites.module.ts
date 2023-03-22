import { Module } from '@nestjs/common';
import { SatellitesService } from './satellites.service';
import { SatellitesController } from './satellites.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SatellitesController],
  providers: [SatellitesService],
  imports: [PrismaModule],
})
export class SatellitesModule {}

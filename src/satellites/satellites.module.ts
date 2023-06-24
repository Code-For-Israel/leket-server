import { Logger, Module } from '@nestjs/common';
import { SatellitesService } from './satellites.service';
import { SatellitesController } from './satellites.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FieldsService } from '../fields/fields.service';
import { HistoriesService } from '../histories/histories.service';

@Module({
  controllers: [SatellitesController],
  providers: [SatellitesService, FieldsService, HistoriesService, Logger],
  imports: [PrismaModule],
})
export class SatellitesModule {}

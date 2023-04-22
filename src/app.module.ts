import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FieldsModule } from './fields/fields.module';
import { SatellitesModule } from './satellites/satellites.module';
import { AttractivenessModule } from './attractivenesses/attractiveness.module';
import { MarketsModule } from './markets/markets.module';
import { MissionsModule } from './missions/missions.module';
import { HistoriesModule } from './histories/histories.module';

@Module({
  imports: [
    PrismaModule,
    FieldsModule,
    SatellitesModule,
    AttractivenessModule,
    MarketsModule,
    MissionsModule,
    HistoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FieldsModule } from './fields/fields.module';
import { SatelitesModule } from './satelites/satelites.module';
import { AttractivenessesModule } from './attractivenesses/attractivenesses.module';
import { MarketsModule } from './markets/markets.module';
import { MissionsModule } from './missions/missions.module';

@Module({
  imports: [
    PrismaModule,
    FieldsModule,
    SatelitesModule,
    AttractivenessesModule,
    MarketsModule,
    MissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

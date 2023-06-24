import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [HistoriesController],
  providers: [HistoriesService],
  imports: [PrismaModule],
})
export class HistoriesModule {}

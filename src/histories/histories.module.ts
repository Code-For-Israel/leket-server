import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [HistoriesService],
  imports: [PrismaModule],
})
export class HistoriesModule {}

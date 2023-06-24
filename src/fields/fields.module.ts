import { Logger, Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoriesService } from '../histories/histories.service';
import { TasksService } from './status-executor';

@Module({
  controllers: [FieldsController],
  providers: [FieldsService, HistoriesService, Logger, TasksService],
  imports: [PrismaModule],
})
export class FieldsModule {}

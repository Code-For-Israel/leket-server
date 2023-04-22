import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoriesService } from '../histories/histories.service';

@Module({
  controllers: [FieldsController],
  providers: [FieldsService, HistoriesService],
  imports: [PrismaModule],
})
export class FieldsModule {}

import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [FieldsController],
  providers: [FieldsService],
  imports: [PrismaModule],
})
export class FieldsModule {}

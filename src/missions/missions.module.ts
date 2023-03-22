import { Module } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [MissionsController],
  providers: [MissionsService],
  imports: [PrismaModule],
})
export class MissionsModule {}

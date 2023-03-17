import { Module } from '@nestjs/common';
import { AttractivenessService } from './attractiveness.service';
import { AttractivenessController } from './attractiveness.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [AttractivenessController],
  providers: [AttractivenessService],
  imports: [PrismaModule],
})
export class AttractivenessModule {}

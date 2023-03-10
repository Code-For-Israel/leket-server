import { Module } from '@nestjs/common';
import { AttractivenessService } from './attractiveness.service';
import { AttractivenessController } from './attractiveness.controller';

@Module({
  controllers: [AttractivenessController],
  providers: [AttractivenessService],
})
export class AttractivenessModule {}

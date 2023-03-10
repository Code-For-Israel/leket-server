import { Test, TestingModule } from '@nestjs/testing';
import { AttractivenessController } from './attractiveness.controller';
import { AttractivenessService } from './attractiveness.service';

describe('AttractivenessesController', () => {
  let controller: AttractivenessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractivenessController],
      providers: [AttractivenessService],
    }).compile();

    controller = module.get<AttractivenessController>(AttractivenessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

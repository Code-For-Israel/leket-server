import { Test, TestingModule } from '@nestjs/testing';
import { AttractivenessesController } from './attractivenesses.controller';
import { AttractivenessesService } from './attractivenesses.service';

describe('AttractivenessesController', () => {
  let controller: AttractivenessesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractivenessesController],
      providers: [AttractivenessesService],
    }).compile();

    controller = module.get<AttractivenessesController>(
      AttractivenessesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

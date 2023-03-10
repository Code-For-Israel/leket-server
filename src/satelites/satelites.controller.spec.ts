import { Test, TestingModule } from '@nestjs/testing';
import { SatelitesController } from './satelites.controller';
import { SatelitesService } from './satelites.service';

describe('SatelitesController', () => {
  let controller: SatelitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SatelitesController],
      providers: [SatelitesService],
    }).compile();

    controller = module.get<SatelitesController>(SatelitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

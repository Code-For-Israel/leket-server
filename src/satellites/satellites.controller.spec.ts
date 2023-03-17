import { Test, TestingModule } from '@nestjs/testing';
import { SatelitesController } from './satellites.controller';
import { SatellitesService } from './satellites.service';

describe('SatelitesController', () => {
  let controller: SatelitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SatelitesController],
      providers: [SatellitesService],
    }).compile();

    controller = module.get<SatelitesController>(SatelitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

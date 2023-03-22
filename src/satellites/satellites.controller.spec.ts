import { Test, TestingModule } from '@nestjs/testing';
import { SatellitesController } from './satellites.controller';
import { SatellitesService } from './satellites.service';

describe('SatellitesController', () => {
  let controller: SatellitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SatellitesController],
      providers: [SatellitesService],
    }).compile();

    controller = module.get<SatellitesController>(SatellitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

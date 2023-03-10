import { Test, TestingModule } from '@nestjs/testing';
import { SatelitesService } from './satelites.service';

describe('SatelitesService', () => {
  let service: SatelitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SatelitesService],
    }).compile();

    service = module.get<SatelitesService>(SatelitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

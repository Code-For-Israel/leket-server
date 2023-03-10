import { Test, TestingModule } from '@nestjs/testing';
import { AttractivenessService } from './attractiveness.service';

describe('AttractivenessesService', () => {
  let service: AttractivenessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttractivenessService],
    }).compile();

    service = module.get<AttractivenessService>(AttractivenessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

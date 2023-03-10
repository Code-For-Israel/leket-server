import { Test, TestingModule } from '@nestjs/testing';
import { AttractivenessesService } from './attractivenesses.service';

describe('AttractivenessesService', () => {
  let service: AttractivenessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttractivenessesService],
    }).compile();

    service = module.get<AttractivenessesService>(AttractivenessesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

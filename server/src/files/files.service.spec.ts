import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService, ConfigService],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

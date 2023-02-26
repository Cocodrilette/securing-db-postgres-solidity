import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductImage } from '../products/entities/product-image.entity';
import { DataSource } from 'typeorm';
import { ResponseParser } from '../common/lib/response';
import { ConfigService } from '@nestjs/config';
import { ObjectParser } from '../common/lib/object';

describe('SeedService', () => {
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: jest.fn(),
        },
        {
          provide: DataSource,
          useValue: jest.fn(),
        },
        ResponseParser,
        ConfigService,
        ObjectParser,
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

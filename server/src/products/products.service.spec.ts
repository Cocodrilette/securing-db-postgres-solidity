import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CommonModule } from '../common/common.module';
import { ConfigModule } from '@nestjs/config';
import { ProductImage } from './entities/product-image.entity';
import { ResponseParser } from '../common/lib/response';
import { ObjectParser } from '../common/lib/object';
import { DataSource } from 'typeorm';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            removeAll: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: {
            create: jest.fn(),
          },
        },
        { provide: DataSource, useValue: jest.fn() },
        ResponseParser,
        ObjectParser,
      ],
      imports: [CommonModule, ConfigModule],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

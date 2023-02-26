import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { DataSource } from 'typeorm';
import { ResponseParser } from '../common/lib/response';
import { ConfigService } from '@nestjs/config';
import { ObjectParser } from '../common/lib/object';

describe('SeedController', () => {
  let controller: SeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
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

    controller = module.get<SeedController>(SeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

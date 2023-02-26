import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CommonModule } from '../common/common.module';
import { ConfigModule } from '@nestjs/config';
import { ProductImage } from './entities';
import { DataSource } from 'typeorm';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
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
      ],
      imports: [CommonModule, ConfigModule],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

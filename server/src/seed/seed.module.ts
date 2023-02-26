import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { CommonModule } from '../common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService, ProductsService],
  imports: [ProductsModule, CommonModule, ConfigModule, AuthModule],
})
export class SeedModule {}

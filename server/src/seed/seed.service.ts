import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    try {
      this.deleteTables();
      const adminUser = await this.insertUsers();
      const result = await this.insertProducts(adminUser);

      if (result.status === 401)
        throw new UnauthorizedException({
          message: result.response,
        });

      return this.sendResult();
    } catch (error) {
      this.logger.error(error);
      if (error.status === 401)
        throw new UnauthorizedException(error.response.message);

      return this.sendResult(error);
    }
  }

  private async deleteTables() {
    await this.productsService.removeAll();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    try {
      const seedUsers = initialData.users;
      const users: User[] = [];
      seedUsers.forEach(async (user) => {
        users.push(this.userRepository.create(user));
      });

      await this.userRepository.save(users);
      return users[0];
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`,
      );
    }
  }

  private async insertProducts(user: User) {
    try {
      const res = await this.productsService.removeAll();

      const products = initialData.products;

      const insertPromises = [];

      products.forEach((product) => {
        insertPromises.push(this.productsService.create(product, user));
      });

      await Promise.all(insertPromises);

      return res;
    } catch (error) {
      return error;
    }
  }

  private sendResult(error?: Error) {
    if (error) {
      throw new InternalServerErrorException({
        ok: false,
        message: 'Seed generation failed',
      });
    }

    return {
      ok: true,
      message: 'Seed generated successfully',
    };
  }
}

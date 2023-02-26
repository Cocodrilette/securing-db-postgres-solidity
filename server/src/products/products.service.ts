import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities';
import { ResponseParser } from '../common/lib/response';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ObjectParser } from '../common/lib/object';
import { ProductImage } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsServices');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
    private readonly responseParser: ResponseParser,
    private readonly configService: ConfigService,
    private readonly objectParser: ObjectParser,
  ) {}
  defaultLimit = this.configService.get<number>('defaultLimit');
  environment = this.configService.get<string>('environment');

  //
  // * CREATE
  //
  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          /**
           * When you sent an image from the client, this image is just a string.
           * The entity required a instance of a ProductImage, so you need to parse that string.
           * TypeORM infers the rest of the fields.
           */
          this.productImageRepository.create({ url: image }),
        ),
        user,
      });

      await this.productRepository.save(product);

      return this.responseParser.createdSuccessfully(
        { ...product, images },
        'Product',
      );
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      this.handleException(error);
    }
  }
  //
  // * FIND ALL
  //
  async findAll({ offset = 0, limit = this.defaultLimit }: PaginationDto) {
    try {
      const products = await this.productRepository.find({
        where: {},
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });

      if (products.length === 0) throw new NotFoundException();

      return this.responseParser.successQuery(
        products,
        products.length,
        'Products',
      );
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Product database empty');
      }

      throw new InternalServerErrorException(error);
    }
  }
  /**
   * * FIND ONE
   *
   * @param searchTerm Can be an UUID, represents the id of the product from the DB
   *                   or the product `name` or `slug`.
   * @returns One Product | NotFoundException | InternalServerErrorException
   */
  async findOne(searchTerm: string) {
    let product: Product;

    try {
      if (isUUID(searchTerm)) {
        product = await this.productRepository.findOneBy({
          id: searchTerm,
        });
      } else {
        product = await this.productRepository
          .createQueryBuilder('product')
          .where('UPPER(name) =:name or slug =:slug', {
            name: searchTerm.toUpperCase(),
            slug: searchTerm.toLowerCase(),
          })
          .leftJoinAndSelect('product.images', 'productImages')
          .getOne();
      }

      if (!product) throw new NotFoundException();

      return this.responseParser.successQuery(product, null, 'Product');
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(`No matches found for: [ ${searchTerm} ]`);

      this.handleException(error);
    }
  }
  //
  // * UPDATE
  //
  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      /**
       * -> Find a product in the DTO
       * -> Keep the ID
       * -> Replace the properties passed through the `updateProductDto`
       */

      // * Check if the request body is empty and throw an error if it is
      if (this.objectParser.isEmpty(updateProductDto))
        throw new BadRequestException();

      const { images, ...productFields } = updateProductDto;

      const product = await this.productRepository.preload({
        id,
        ...productFields,
      });

      /**
       * QueryRunner allow us to take a single connection from the connection pool or
       * the default data source.
       * By this way, we can make more than one query through a single connection.
       * details: https://orkhan.gitbook.io/typeorm/docs/query-runner#using-queryrunner
       * ! IMPORTANT:
       * ! make sure to release it when it is not needed anymore to make it available to the connection pool again
       */
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );

        product.user = user;
        await queryRunner.manager.save(product);
        await queryRunner.commitTransaction();
        await queryRunner.release(); // * connection released
      } else {
        product.images = await this.productImageRepository.findBy({
          product: { id },
        });
      }

      if (!product) throw new NotFoundException();

      return this.responseParser.updatedSuccessfully('Product', product, id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if (error.status === 404)
        throw new NotFoundException(`Product with id: [ ${id} ] not found`);

      if (error.status === 400)
        throw new BadRequestException(
          'You sent nothing to change. Please try again with some values to update',
        );

      this.handleException(error);
    }
  }
  //
  // * REMOVE
  //
  async remove(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) throw new NotFoundException();

      await this.productRepository.remove(product);

      return this.responseParser.deletedSuccessfully('Product', id);
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(`Product with the id ${id} not found`);
      this.handleException(error);
    }
  }

  async removeAll() {
    try {
      if (this.environment !== 'dev') {
        throw new UnauthorizedException();
      }

      const query = this.productRepository.createQueryBuilder('product');
      return await query.delete().where({}).execute();
    } catch (error) {
      if (error.status === 401) {
        throw new UnauthorizedException(
          'This action is highly destructive. Is not allowed to do it in production',
        );
      }
      this.handleException(error);
    }
  }

  private handleException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { User } from '../auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid token',
  })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth()
  findAll(
    @Query()
    paginationDto: PaginationDto,
  ) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':searchTerm')
  @Auth()
  findOne(@Param('searchTerm') searchTerm: string) {
    return this.productsService.findOne(searchTerm);
  }

  @Patch(':id')
  @Auth(ValidRoles.Admin, ValidRoles.SuperUser)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete('seed')
  @Auth(ValidRoles.SuperUser)
  removeAll() {
    return this.productsService.removeAll();
  }

  @Delete(':id')
  @Auth(ValidRoles.Admin, ValidRoles.SuperUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}

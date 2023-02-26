import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Blue Shirt',
    description: 'Product name',
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 49.99, default: 0, nullable: false })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 'Jeans Clothes',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  description?: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    example: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Product sizes',
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    example: 'MEN',
    description: 'Product gender',
    nullable: false,
  })
  @IsIn(['MEN', 'WOMEN', 'KID', 'UNISEX'])
  gender: string;

  @ApiProperty({
    example: ['tag-1', 'tag-2'],
    description: 'Product tags',
    nullable: false,
  })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    example: ['https://...', 'https://...'],
    description: 'Product images',
    nullable: false,
  })
  @IsOptional()
  images: string[];
}

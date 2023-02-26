/**
 * An entity represents a table in the database
 */

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SlugParser } from '../../common/lib/slug';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

const slugParser = new SlugParser() as SlugParser;
@Entity()
export class Product {
  @ApiProperty({
    example: '96380c0d-3aea-4553-afa4-c15a889f812d',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Blue Shirt',
    description: 'Product name',
  })
  @Column('text', { unique: true })
  name: string;

  @ApiProperty({ example: 49.99, default: 0 })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty()
  @ApiProperty({
    example: 'Jeans Clothes',
    description: 'Product description',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 'blue-shirt',
    description: 'Product slug',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Product sizes',
  })
  @Column('text', { nullable: false, array: true })
  sizes: string[];

  @ApiProperty({
    example: 'MEN',
    description: 'Product gender',
  })
  @Column('text', { nullable: false })
  gender: string;

  @ApiProperty({
    example: ['tag-1', 'tag-2'],
    description: 'Product tags',
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, // automatically load the relations from the database
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;
  //
  @BeforeInsert()
  @BeforeUpdate()
  parseSlug() {
    this.slug = slugParser.parse(this.name);
  }
}

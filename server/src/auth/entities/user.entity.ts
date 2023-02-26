import { IsString } from 'class-validator';
import { Product } from '../../products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  @IsString()
  email: string;

  @Column('text')
  @IsString()
  fullName: string;

  @Column('text', {
    select: false,
  })
  @IsString()
  password: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['USER'] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLocaleLowerCase().trim();
  }
}

import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AppController } from './app.controller';
import { JoiValidationSchema } from './config/joiValidationSchema';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { ContributionsModule } from './contributions/contributions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: JoiValidationSchema,
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_NAME,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      /**
       * * Automatic apply the schema changes
       * * The line below turn off this feat in production
       * * by checking the `NODE_ENV` env var
       *  */
      synchronize: process.env.NODE_ENV === 'dev' ? true : false,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule,

    MessagesWsModule,

    ContributionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

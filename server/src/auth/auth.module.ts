import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const JWT_SECRET = configService.get('JWT_SECRET');

        if (!JWT_SECRET) throw new Error('JWT_SECRET must be defined');

        return {
          secret: JWT_SECRET,
          signOptions: { expiresIn: '12h' },
        };
      },
    }),
  ],
  exports: [TypeOrmModule, AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}

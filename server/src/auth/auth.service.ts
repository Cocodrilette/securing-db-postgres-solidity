import {
  Injectable,
  BadRequestException,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { HashAdapter } from './adapters/hash.adapter';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

export interface SuccessResponse {
  ok: boolean;
  token: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private readonly hashAdapter: HashAdapter = new HashAdapter();
  private readonly logger = new Logger(AuthService.name);

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<SuccessResponse | Error> {
    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: await this.hashAdapter.hash(createUserDto.password),
      });

      await this.userRepository.save(user);

      return {
        ok: true,
        token: this.jwtToken({ id: user.id }),
        id: user.id,
      };
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async loginUser(user: LoginUserDto): Promise<SuccessResponse | Error> {
    try {
      const email = user.email.toLowerCase().trim();
      const { password } = user;

      const userFound = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password'],
      });

      if (!userFound)
        throw new UnauthorizedException('Invalid credentials (email)');

      const isPasswordValid = await this.hashAdapter.compare(
        password,
        userFound.password,
      );

      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials (password)');

      return {
        ok: true,
        token: this.jwtToken({ id: userFound.id }),
        id: userFound.id,
      };
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async checkAuthStatus(user: User) {
    try {
      return {
        ok: true,
        token: this.jwtToken({ id: user.id }),
        id: user.id,
      };
    } catch (error) {
      this.errorHandler(error);
    }
  }

  private jwtToken({ id }: JwtPayload) {
    try {
      const token = this.jwtService.sign({ id });

      if (typeof token !== typeof 'string') {
        throw new Error(token);
      }
      return token;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private errorHandler(error: any): never {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new BadRequestException(error.message);
  }
}

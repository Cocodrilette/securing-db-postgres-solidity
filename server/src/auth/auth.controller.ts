import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
import { RoleProtected } from './decorators/';
import { Auth } from './decorators/auth.decorator';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

export const META_ROLES = 'roles';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User was created',
  })
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'User was logged in',
  })
  loginUser(@Body() user: LoginUserDto) {
    return this.authService.loginUser(user);
  }

  @Get()
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'User was logged in',
  })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiResponse({})
  testingPrivateRoute(@GetUser('id') userId: string) {
    return {
      ok: true,
      message: 'You are authorized to see this message',
      userId,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.Admin, ValidRoles.SuperUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiResponse({})
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.Admin)
  @ApiResponse({})
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}

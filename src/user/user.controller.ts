import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Username or email already exists.' })
  @ApiResponse({ status: 400, description: 'Bad request. Validation failed.' })
  async register(@Body() createUserDto: CreateUserDto) {

    const existingUser = await this.userService.findOneByUsername(createUserDto.username);
    const existingEmail = await this.userService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    if (existingEmail) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }


    return this.userService.create(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );
  }
}

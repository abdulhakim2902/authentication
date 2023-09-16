import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { AuthService } from './auth.service';
import { User } from 'src/modules/user/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { Nonce, UserProfile } from 'src/interfaces';
import { Public } from 'src/decorators';
import { ApiTags, ApiFoundResponse, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiCreatedResponse({ type: User })
  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() data: RegisterUserDto): Promise<User> {
    return this.authService.register(data);
  }

  @Public()
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() data: LoginUserDto): Promise<UserProfile> {
    return this.authService.login(data);
  }

  @Public()
  @ApiFoundResponse({ type: Nonce })
  @Get('/nonce')
  async nonce(@Query('address') address?: string): Promise<Nonce> {
    return this.authService.nonce(address);
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiFoundResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { User } from '../user.entity';
import { UserProfile } from 'src/decorators';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiFoundResponse({ type: User })
  @Get('/me')
  async me(@UserProfile('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }
}

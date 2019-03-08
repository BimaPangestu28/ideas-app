import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UserRO } from './user.dto';
import { AuthGuard } from '../shared/auth.guard';
import { User } from './user.decorator';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  @UseGuards(new AuthGuard())
  async showAllUsers(@User() user) {
    return await this.userService.showAll();
  }

  @Post('login')
  async login(@Body() data: UserDTO): Promise<UserRO> {
    return await this.userService.login(data);
  }

  @Post('register')
  async register(@Body() data: UserDTO): Promise<UserRO> {
    return await this.userService.register(data);
  }
}

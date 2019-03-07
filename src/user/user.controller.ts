import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UserRO } from './user.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/users')
  async showAllUsers() {
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

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO, UserRO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll() {
    const users = await this.userRepository.find({
      relations: ['bookmarks', 'ideas'],
    });

    return users.map(user => user.toResponseObject());
  }

  async login(data: UserDTO): Promise<UserRO[]> {
    const { username, password } = data;

    const authentication = await this.userRepository.findOne({ username });

    if (!authentication || !(await authentication.comparePassword(password))) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return authentication.toResponseObject(true);
  }

  async register(data: UserDTO): Promise<UserRO[]> {
    const { username } = data;

    if (await this.userRepository.findOne({ username })) {
      throw new HttpException('Username already used', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.create(data);
    await this.userRepository.save(user);

    return user.toResponseObject(true);
  }
}

import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ideaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ideaDTO, IdeaRO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(ideaEntity)
    private ideaRepository: Repository<ideaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(idea: ideaEntity) {
    return {
      ...idea,
      author: idea.author.toResponseObject() || null,
    };
  }

  async showAll() {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });

    return ideas.map(idea => this.toResponseObject(idea));
  }

  async create(userId: any, data: ideaDTO): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ id: userId });
    const idea = await this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save({ ...data, author: user });

    return this.toResponseObject(idea);
  }

  async read(id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne(
      { id },
      { relations: ['author'] },
    );

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(idea);
  }

  async update(
    id: string,
    data: Partial<ideaDTO>,
    userId: string,
  ): Promise<IdeaRO> {
    let idea: any = await this.ideaRepository.findOne(
      { id },
      { relations: ['author'] },
    );

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    if (idea.author.id !== userId) {
      throw new HttpException(
        'Unauthorized to access this data',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.ideaRepository.update({ id }, data);

    idea = await this.ideaRepository.findOne({ id }, { relations: ['author'] });

    return this.toResponseObject(idea);
  }

  async delete(id: string, userId: string) {
    const idea = await this.ideaRepository.findOne(
      { id },
      { relations: ['author'] },
    );

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    if (idea.author.id !== userId) {
      throw new HttpException(
        'Unauthorized to access this data',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.ideaRepository.delete({ id });

    return { deleted: true };
  }
}

import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ideaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ideaDTO, IdeaRO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserRO } from 'src/user/user.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(ideaEntity)
    private ideaRepository: Repository<ideaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(idea) {
    const responseObject: any = {
      ...idea,
      author: idea.author.toResponseObject(),
    };

    if (responseObject.likes) {
      responseObject.likes = responseObject.likes.length;
    }

    if (responseObject.dislikes) {
      responseObject.dislikes = responseObject.dislikes.length;
    }

    return responseObject;
  }

  private ensureOwnership(idea: ideaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException(
        'Unauthorized to access this data',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async showAll() {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'likes', 'dislikes'],
    });

    return ideas.map(idea => this.toResponseObject(idea));
  }

  async create(userId: any, data: ideaDTO) {
    const user = await this.userRepository.findOne({ id: userId });
    const idea = await this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save({ ...data, author: user });

    return this.toResponseObject(idea);
  }

  async read(id: string) {
    const idea = await this.ideaRepository.findOne(
      { id },
      { relations: ['author'] },
    );

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(idea);
  }

  async update(id: string, data: Partial<ideaDTO>, userId: string) {
    let idea: any = await this.ideaRepository.findOne(
      { id },
      { relations: ['author'] },
    );

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    this.ensureOwnership(idea, userId);

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

    this.ensureOwnership(idea, userId);

    await this.ideaRepository.delete({ id });

    return { deleted: true };
  }

  async bookmark(id: string, userId: string): Promise<UserRO> {
    const idea: any = await this.ideaRepository.findOne({ id });
    const user: any = await this.userRepository.findOne(
      { id: userId },
      { relations: ['bookmarks'] },
    );

    if (!idea) {
      throw new HttpException('Idea not found!', HttpStatus.BAD_REQUEST);
    }

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Idea has already bookmark',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async unbookmark(id: string, userId: string): Promise<UserRO> {
    const idea: any = await this.ideaRepository.findOne({ id });
    const user: any = await this.userRepository.findOne(
      { id: userId },
      { relations: ['bookmarks'] },
    );

    if (!idea) {
      throw new HttpException('Idea not found!', HttpStatus.BAD_REQUEST);
    }

    if (user.bookmarks.filter(bookmark => bookmark.id === id).length > 0) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== idea.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Idea has not already bookmark',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async like(id: string, userId: string): Promise<UserRO> {
    const idea: any = await this.ideaRepository.findOne(
      { id },
      { relations: ['likes', 'dislikes', 'author'] },
    );
    const user = await this.userRepository.findOne({ id: userId });

    if (!idea) {
      throw new HttpException('Idea not found', HttpStatus.BAD_GATEWAY);
    }

    if (idea.dislikes.filter(dislike => dislike.id === userId).length > 0) {
      idea.dislikes = idea.dislikes.filter(dislike => dislike.id !== userId);
      this.ideaRepository.save(idea);
    }

    if (idea.likes.filter(like => like.id === userId).length < 1) {
      idea.likes.push(user);
      this.ideaRepository.save(idea);
    } else {
      idea.likes = idea.likes.filter(like => like.id !== userId);
      this.ideaRepository.save(idea);
    }

    return this.toResponseObject(idea);
  }

  async dislike(id: string, userId: string): Promise<UserRO> {
    const idea: any = await this.ideaRepository.findOne(
      { id },
      { relations: ['likes', 'dislikes', 'author'] },
    );
    const user = await this.userRepository.findOne({ id: userId });

    if (!idea) {
      throw new HttpException('Idea not found', HttpStatus.BAD_GATEWAY);
    }

    if (idea.likes.filter(like => like.id === userId).length > 0) {
      idea.likes = idea.likes.filter(like => like.id !== userId);
      this.ideaRepository.save(idea);
    }

    if (idea.dislikes.filter(dislike => dislike.id === userId).length < 1) {
      idea.dislikes.push(user);
      this.ideaRepository.save(idea);
    } else {
      idea.dislikes = idea.dislikes.filter(dislike => dislike.id !== userId);
      this.ideaRepository.save(idea);
    }

    return this.toResponseObject(idea);
  }
}

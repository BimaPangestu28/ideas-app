import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ideaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ideaDTO } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(ideaEntity)
    private ideaRepository: Repository<ideaEntity>,
  ) {}

  async showAll() {
    return await this.ideaRepository.find();
  }

  async create(data: ideaDTO) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(data);

    return idea;
  }

  async read(id: string) {
    const idea = await this.ideaRepository.findOne({ id });

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return idea;
  }

  async update(id: string, data: Partial<ideaDTO>) {
    const idea = await this.ideaRepository.findOne({ id });

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.update({ id }, data);

    return this.ideaRepository.findOne({ id });
  }

  async delete(id: string) {
    const idea = await this.ideaRepository.findOne({ id });

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.delete({ id });

    return { deleted: true };
  }
}

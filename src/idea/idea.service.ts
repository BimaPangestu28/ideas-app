import { Injectable } from '@nestjs/common';
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
    return await this.ideaRepository.findOneOrFail({ id });
  }

  async update(id: string, data: Partial<ideaDTO>) {
    await this.ideaRepository.update({ id }, data);

    return this.ideaRepository.findOneOrFail({ id });
  }

  async delete(id: string) {
    await this.ideaRepository.delete({ id });

    return { deleted: true };
  }
}

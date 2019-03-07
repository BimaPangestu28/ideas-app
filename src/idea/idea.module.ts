import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ideaEntity } from './idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ideaEntity])],
  providers: [IdeaService],
  controllers: [IdeaController],
})
export class IdeaModule {}

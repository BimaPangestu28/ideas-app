import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ideaEntity } from './idea.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ideaEntity, UserEntity])],
  providers: [IdeaService],
  controllers: [IdeaController],
})
export class IdeaModule {}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity('idea')
export class ideaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('text') idea: string;

  @Column('text') description: string;

  @CreateDateColumn() created: Date;

  @ManyToOne(type => UserEntity, author => author.ideas)
  author: UserEntity;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  likes: UserEntity;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  dislikes: UserEntity;
}

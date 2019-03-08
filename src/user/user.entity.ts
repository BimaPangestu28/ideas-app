import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { ideaEntity } from 'src/idea/idea.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text') password: string;

  @CreateDateColumn() created: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(type => ideaEntity, idea => idea.author)
  ideas: ideaEntity;

  toResponseObject(showToken = false): Promise<UserRO[]> {
    const { id, username, created, token } = this;
    let responseObject: any = { id, username, created };

    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  private get token() {
    const { id, username } = this;

    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET_JWT,
      { expiresIn: '7d' },
    );
  }
}

import { IsString, IsDefined } from 'class-validator';
import { UserRO } from 'src/user/user.dto';

export class ideaDTO {
  @IsString()
  @IsDefined()
  idea: string;

  @IsString()
  @IsDefined()
  description: string;
}

export interface IdeaRO {
  id: string;
  idea: string;
  description: string;
  created: Date;
  author: Promise<UserRO[]>;
}

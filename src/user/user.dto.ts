import { IsString, IsDefined } from 'class-validator';
import { ideaDTO } from 'src/idea/idea.dto';

export class UserDTO {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;
}

export interface UserRO {
  id: string;
  username: string;
  created: string;
  token?: string;
  bookmarks?: Promise<ideaDTO[]>;
}

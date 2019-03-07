import { IsString, IsDefined } from 'class-validator';

export class ideaDTO {
  @IsString()
  @IsDefined()
  idea: string;

  @IsString()
  @IsDefined()
  description: string;
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { ideaDTO } from './idea.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  createIdea(@User('id') user, @Body(new ValidationPipe()) data: ideaDTO) {
    return this.ideaService.create(user, data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  updateIdea(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: Partial<ideaDTO>,
    @User('id') user,
  ) {
    return this.ideaService.update(id, data, user);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyIdea(@Param('id') id: string, @User('id') user) {
    return this.ideaService.delete(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkIdea(@Param('id') id: string, @User('id') user) {
    return this.ideaService.bookmark(id, user);
  }

  @Post(':id/unbookmark')
  @UseGuards(new AuthGuard())
  unbookmarkIdea(@Param('id') id: string, @User('id') user) {
    return this.ideaService.unbookmark(id, user);
  }

  @Post(':id/like')
  @UseGuards(new AuthGuard())
  likeIdea(@Param('id') id: string, @User('id') user) {
    return this.ideaService.like(id, user);
  }

  @Post(':id/dislike')
  @UseGuards(new AuthGuard())
  dislikeIdea(@Param('id') id: string, @User('id') user) {
    return this.ideaService.dislike(id, user);
  }
}

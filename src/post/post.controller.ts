import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CreateInput, CreateOutPut } from './dtos/create.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createInput: CreateInput): Promise<any> {
    return this.postService.createPost(createInput);
  }
}

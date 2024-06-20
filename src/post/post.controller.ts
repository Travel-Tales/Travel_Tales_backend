import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { IdParamDto } from './dtos/pathvariable.dto';
import { UpdateInputDto } from './dtos/update.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body() createInputDto: CreateInputDto,
  ): Promise<CreateOutPutDto> {
    return this.postService.createPost(createInputDto);
  }

  @Patch(':id')
  async updatePost(
    @Param() params: IdParamDto,
    @Body() updateInputDto: UpdateInputDto,
  ): Promise<void> {
    await this.postService.updatePost(params.id, updateInputDto);
  }
}

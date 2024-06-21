import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { IdParamDto } from './dtos/pathvariable.dto';
import { UpdateInputDto } from './dtos/update.dto';
import { PostService } from './post.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '게시물 생성 API',
    description: '게시물 생성',
  })
  @ApiBearerAuth()
  @Post()
  async createPost(
    @Body() createInputDto: CreateInputDto,
  ): Promise<CreateOutPutDto> {
    return this.postService.createPost(createInputDto);
  }

  @ApiOperation({
    summary: '게시물 수정 API',
    description: '게시물 수정',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  @ApiBody({ type: UpdateInputDto })
  async updatePost(
    @Param('id') id: number,
    @Body() updateInputDto: UpdateInputDto,
  ): Promise<void> {
    await this.postService.updatePost(id, updateInputDto);
  }
}

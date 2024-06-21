import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { Role } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '게시물 생성 API',
    description: '게시물 생성',
  })
  @ApiBearerAuth('Authorization')
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Post()
  async createPost(
    @Req() req,
    @Body() createInputDto: CreateInputDto,
  ): Promise<CreateOutPutDto> {
    console.log(req.user);
    return this.postService.createPost(createInputDto);
  }

  @ApiOperation({
    summary: '게시물 수정 API',
    description: '게시물 수정',
  })
  @ApiBearerAuth('Authorization')
  @ApiParam({ name: 'id', type: Number })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Patch(':id')
  @ApiBody({ type: UpdateInputDto })
  async updatePost(
    @Param('id') id: number,
    @Body() updateInputDto: UpdateInputDto,
  ): Promise<void> {
    await this.postService.updatePost(id, updateInputDto);
  }
}

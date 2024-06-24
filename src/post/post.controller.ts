import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
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
import { User } from 'src/common/decorators/user.decorator';
import { IPayload } from 'src/jwt/interfaces';
import { TravelPost } from 'src/entities';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '게시물 생성 API',
    description: '게시물 생성',
  })
  @ApiBearerAuth('Authorization')
  @Role(['Any'])
  @UseGuards(RoleGuard)
  @Get()
  async getPost(@User() user: IPayload): Promise<TravelPost[]> {
    return this.postService.getPost(user);
  }

  @ApiOperation({
    summary: '게시물 생성 API',
    description: '게시물 생성',
  })
  @ApiBearerAuth('Authorization')
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Post()
  async createPost(
    @User() user: IPayload,
    @Body() createInputDto: CreateInputDto,
  ): Promise<CreateOutPutDto> {
    return this.postService.createPost(user, createInputDto);
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
    @User() user: IPayload,
    @Param('id') id: number,
    @Body() updateInputDto: UpdateInputDto,
  ): Promise<void> {
    await this.postService.updatePost(id, updateInputDto);
  }
}

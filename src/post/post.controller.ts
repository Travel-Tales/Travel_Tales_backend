import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Delete,
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
  ApiOkResponse,
} from '@nestjs/swagger';
import { Role } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserInfo } from 'src/common/decorators/userInfo.decorator';
import { TravelPost, User, UserTravelPost } from 'src/entities';
import { GetPostOutputDTO } from './dtos/get.post.dto';
import { PermissionInputDTO } from './dtos/permission.dto';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '게시물 가져오기',
    description: '게시물 가져오기',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: false,
  })
  @ApiOkResponse({ type: GetPostOutputDTO })
  @Role(['Any'])
  @UseGuards(RoleGuard)
  @Get(':id?')
  async getPost(
    @Param('id') id: number | undefined,
  ): Promise<TravelPost | TravelPost[]> {
    return this.postService.getPost(id);
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
    @UserInfo() userInfo: User,
    @Body() createInputDto: CreateInputDto,
  ): Promise<CreateOutPutDto> {
    return this.postService.createPost(userInfo, createInputDto);
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
    @UserInfo() userInfo: User,
    @Param('id') id: number,
    @Body() updateInputDto: UpdateInputDto,
  ): Promise<void> {
    return this.postService.updatePost(userInfo, id, updateInputDto);
  }

  @ApiOperation({
    summary: '게시물 삭제 API',
    description: '게시물 삭제',
  })
  @ApiBearerAuth('Authorization')
  @ApiParam({ name: 'id', type: Number })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Delete(':id')
  async deletePost(
    @UserInfo() userInfo: User,
    @Param('id') id: number,
  ): Promise<void> {
    return this.postService.deletePost(userInfo, id);
  }

  @ApiOperation({
    summary: '게시물 권한 부여 API',
    description: '게시물 권한 부여',
  })
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: PermissionInputDTO })
  @ApiParam({ name: 'id', type: Number })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Post(':id/permission')
  async setPermission(
    @UserInfo() userInfo: User,
    @Param('id') id: number,
    @Body() permissionInputDTO: PermissionInputDTO,
  ): Promise<void> {
    await this.postService.setPermission(userInfo, id, permissionInputDTO);
  }
}

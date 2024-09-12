import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { UpdatePostInputDto } from './dtos/update.post.dto';
import { PostService } from './post.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiConsumes,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Role } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserInfo } from 'src/common/decorators/userInfo.decorator';
import { TravelPost, User, UserTravelPost } from 'src/entities';
import { GetPostOutputDTO } from './dtos/get.post.dto';
import { PermissionInputDTO } from './dtos/permission.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UploadImageInputDTO,
  UploadImageOutputDTO,
} from './dtos/uploadImage.dto';
import { IDParamDTO } from 'src/common/dtos/id.param';
import { PostQueryStringDTO } from 'src/post/dtos/get.query';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '내 게시물 가져오기 API',
    description: '내 게시물 가져오기',
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({ type: [GetPostOutputDTO] })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Get('/my-post')
  async getMyPost(
    @UserInfo() userInfo: User,
    @Query() query: PostQueryStringDTO,
  ): Promise<TravelPost[]> {
    return this.postService.getMyPost(userInfo, query);
  }

  @ApiOperation({
    summary: '게시물 추천 리스트 가져오기',
    description: '게시물 추천 리스트 가져오기',
  })
  @ApiOkResponse({ type: [GetPostOutputDTO] })
  @Role(['Any'])
  @UseGuards(RoleGuard)
  @Get('recommand')
  async getRecommendPost(): Promise<TravelPost[]> {
    return this.postService.getRecommendPost();
  }

  @ApiOperation({
    summary: '게시물 리스트 가져오기',
    description: '게시물 리스트 가져오기',
  })
  @ApiOkResponse({ type: GetPostOutputDTO })
  @Role(['Any'])
  @UseGuards(RoleGuard)
  @Get('')
  async getPostList(
    @Query() query: PostQueryStringDTO,
  ): Promise<TravelPost | TravelPost[]> {
    return this.postService.getPost(undefined, query);
  }

  @ApiOperation({
    summary: '특정 게시물 가져오기',
    description: '특정 게시물 가져오기',
  })
  @ApiOkResponse({ type: GetPostOutputDTO })
  @Role(['Any'])
  @UseGuards(RoleGuard)
  @Get(':id')
  async getPostById(
    @Param() params: IDParamDTO,
  ): Promise<TravelPost | TravelPost[]> {
    return this.postService.getPost(params.id);
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

  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '게시물 수정 API',
    description: '게시물 수정',
  })
  @ApiBody({ type: UpdatePostInputDto })
  @ApiBearerAuth('Authorization')
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('thumbnailFile'))
  @Patch(':id')
  async updatePost(
    @UserInfo() userInfo: User,
    @Param() params: IDParamDTO,
    @Body() updatePostInputDto: UpdatePostInputDto,
    @UploadedFile() thumbnailFile: Express.Multer.File,
  ): Promise<void> {
    return this.postService.updatePost(
      userInfo,
      params.id,
      updatePostInputDto,
      thumbnailFile,
    );
  }

  @ApiOperation({
    summary: '게시물 삭제 API',
    description: '게시물 삭제',
  })
  @ApiBearerAuth('Authorization')
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Delete(':id')
  async deletePost(
    @UserInfo() userInfo: User,
    @Param() params: IDParamDTO,
  ): Promise<void> {
    return this.postService.deletePost(userInfo, params.id);
  }

  @ApiOperation({
    summary: '게시물 권한 부여 API',
    description: '게시물 권한 부여',
  })
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: PermissionInputDTO })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Post(':id/permission')
  async setPermission(
    @UserInfo() userInfo: User,
    @Param() params: IDParamDTO,
    @Body() permissionInputDTO: PermissionInputDTO,
  ): Promise<void> {
    await this.postService.setPermission(
      userInfo,
      params.id,
      permissionInputDTO,
    );
  }

  @ApiOperation({
    summary: '게시물 사진 URL로 변경',
    description: '게시물 사진 URL',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: UploadImageInputDTO })
  @ApiResponse({ type: UploadImageOutputDTO })
  @UseInterceptors(FileInterceptor('imageFile'))
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Post('upload-image')
  async uploadPostImage(
    @UploadedFile() imageFile: Express.Multer.File,
  ): Promise<string> {
    return this.postService.uploadImageFile(imageFile);
  }
}

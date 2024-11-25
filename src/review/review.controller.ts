import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../common/decorators/role.decorator';
import { UserInfo } from '../common/decorators/userInfo.decorator';
import { IDParamDTO } from '../common/dtos/id.param';
import { RoleGuard } from '../common/guards/role.guard';
import { TravelReview } from '../entities/travel_review.entity';
import { CreateInputDto } from './dtos/create.dto';
import { UpdateReviewInputDto } from './dtos/update.dto';
import { ReviewService } from './review.service';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/')
  async getReviewList(): Promise<any> {
    return this.reviewService.getReviewList();
  }

  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '리뷰 게시물 만들기',
    description: '리뷰 게시물 만들기',
  })
  @Role(['Any'])
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('thumbnailFile'))
  @Get('/:id')
  async getReviewInfo(@Param() params: IDParamDTO): Promise<TravelReview> {
    return this.reviewService.getReviewInfo(params.id);
  }

  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateInputDto })
  @ApiOperation({
    summary: '리뷰 게시물 만들기',
    description: '리뷰 게시물 만들기',
  })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('thumbnailFile'))
  @Post('/')
  async createReview(
    @UserInfo() userInfo,
    @UploadedFile() thumbnailFile: Express.Multer.File,
    @Body() createInputDto: CreateInputDto,
  ): Promise<void> {
    return this.reviewService.createReview(userInfo, createInputDto, thumbnailFile);
  }

  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '게시물 수정 API',
    description: '게시물 수정',
  })
  @ApiBody({ type: UpdateReviewInputDto })
  @ApiBearerAuth('Authorization')
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('thumbnailFile'))
  async updateReview(
    @Param() params: IDParamDTO,
    @UserInfo() userInfo,
    @UploadedFile() thumbnailFile: Express.Multer.File,
    @Body() updateReviewInputDto: UpdateReviewInputDto,
  ) {
    return this.reviewService.updateReview(userInfo, params.id, updateReviewInputDto, thumbnailFile);
  }
}

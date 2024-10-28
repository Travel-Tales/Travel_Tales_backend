import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/role.decorator';
import { UserInfo } from 'src/common/decorators/userInfo.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateInputDto } from './dtos/create.dto';
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
}

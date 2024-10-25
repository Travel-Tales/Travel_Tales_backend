import { Controller, Get } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/')
  async getReviewList(): Promise<string> {
    return this.reviewService.getReviewList();
  }
}

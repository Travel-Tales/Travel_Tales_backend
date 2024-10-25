import { InjectRepository } from '@nestjs/typeorm';
import { TravelReview } from 'src/entities/travel_review.entity';
import { Repository } from 'typeorm';

export class ReviewService {
  constructor(
    @InjectRepository(TravelReview)
    private readonly travelReviewRepository: Repository<TravelReview>,
  ) {}

  async getReviewList(): Promise<string> {
    return 'hello';
  }
}

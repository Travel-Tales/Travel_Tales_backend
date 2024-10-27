import { InjectRepository } from '@nestjs/typeorm';
import { TravelPost, UserTravelPost } from 'src/entities';
import { TravelReview } from 'src/entities/travel_review.entity';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';

export class ReviewService {
  constructor(
    @InjectRepository(TravelReview)
    private readonly travelReviewRepository: Repository<TravelReview>,
    private readonly postService: PostService,
  ) {}

  async getReviewList(): Promise<string> {
    return 'hello';
  }

  async createReview(userInfo, createInputDto): Promise<void> {
    const travelPost: UserTravelPost = await this.postService.getUserTravelPost(
      createInputDto.travelPostId,
      userInfo.id,
    );
    console.log('🚀 ~ ReviewService ~ createReview ~ travelPost:', travelPost);

    await this.travelReviewRepository.save(this.travelReviewRepository.create(createInputDto));
  }
}

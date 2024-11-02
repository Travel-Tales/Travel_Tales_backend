import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { FileAttachment, TravelPost, UserTravelPost } from 'src/entities';
import { TravelReview } from 'src/entities/travel_review.entity';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';

export class ReviewService {
  constructor(
    @InjectRepository(TravelReview)
    private readonly travelReviewRepository: Repository<TravelReview>,
    @InjectRepository(FileAttachment)
    private readonly attachmentRepository: Repository<FileAttachment>,
    private readonly postService: PostService,
    private readonly awsService: AwsService,
  ) {}

  async getReviewList(): Promise<any> {
    return this.travelReviewRepository.find();
  }

  async createReview(userInfo, createInputDto, thumbnailFile): Promise<void> {
    await this.postService.getUserTravelPost(createInputDto.postId, userInfo.id);

    const travelPost = (await this.postService.getPost(createInputDto.postId))[0];

    if (thumbnailFile) {
      const url = await this.awsService.uploadReviewImage(thumbnailFile, createInputDto);
      createInputDto['thumbnail'] = url;
    }

    await this.travelReviewRepository.save(this.travelReviewRepository.create({ ...createInputDto, travelPost }));
  }

  async updateReview(userInfo, updateInputDto, thumbnailFile): Promise<void> {}
}

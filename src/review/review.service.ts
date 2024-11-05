import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { FileAttachment, TravelPost, User, UserTravelPost } from 'src/entities';
import { TravelReview } from 'src/entities/travel_review.entity';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { CreateInputDto } from './dtos/create.dto';
import { UpdateReviewInputDto } from './dtos/update.dto';

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

  async createReview(
    userInfo: User,
    createInputDto: CreateInputDto,
    thumbnailFile: Express.Multer.File,
  ): Promise<void> {
    await this.postService.getUserTravelPost(createInputDto.postId, userInfo.id);
    const travelPost = (await this.postService.getPost(createInputDto.postId))[0];

    if (thumbnailFile) {
      const url = await this.awsService.createReviewImage(thumbnailFile, createInputDto);
      createInputDto['thumbnail'] = url;
    }

    await this.travelReviewRepository.save(this.travelReviewRepository.create({ ...createInputDto }));
  }

  async updateReview(
    userInfo: User,
    id: number,
    updateInputDto: UpdateReviewInputDto,
    thumbnailFile: Express.Multer.File,
  ): Promise<void> {
    await this.postService.getUserTravelPost(updateInputDto.postId, userInfo.id);

    const travelReview = await this.travelReviewRepository.findOne({ where: { id } });

    if (thumbnailFile) {
      const url = await this.awsService.updateReviewImage(thumbnailFile, travelReview);
      updateInputDto['thumbnail'] = url;
    }

    await this.travelReviewRepository.save(this.travelReviewRepository.create({ ...updateInputDto }));
  }

  async getReviewInfo(id: number): Promise<TravelReview> {
    return this.travelReviewRepository.findOne({ where: { id } });
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from '../aws/aws.service';
import { FileAttachment, TravelPost, User, UserTravelPost } from '../entities';
import { TravelReview } from '../entities/travel_review.entity';
import { PostService } from '../post/post.service';
import { In, Repository } from 'typeorm';
import { CreateInputDto } from './dtos/create.dto';
import { UpdateReviewInputDto } from './dtos/update.dto';
import { create } from 'domain';

export class ReviewService {
  constructor(
    @InjectRepository(TravelReview)
    private readonly travelReviewRepository: Repository<TravelReview>,
    @InjectRepository(FileAttachment)
    private readonly attachmentRepository: Repository<FileAttachment>,
    private readonly postService: PostService,
    private readonly awsService: AwsService,
  ) {}

  async getReviewList(): Promise<TravelReview[]> {
    return this.travelReviewRepository.find();
  }

  async getMyReview(userInfo: User): Promise<TravelReview[]> {
    const travelPost: TravelPost[] = await this.postService.getMyPost(userInfo);

    const ids = travelPost.map((ele) => ele.id);

    return this.travelReviewRepository.findBy({ travelPost: In(ids) });
  }

  async createReview(
    userInfo: User,
    createInputDto: CreateInputDto,
    thumbnailFile: Express.Multer.File,
  ): Promise<void> {
    await this.postService.getUserTravelPost(createInputDto.travelPostId, userInfo.id);
    const travelPost: TravelPost = (await this.postService.getPost(createInputDto.travelPostId))[0];

    if (thumbnailFile) {
      const url = await this.awsService.createReviewImage(thumbnailFile, createInputDto);
      createInputDto['thumbnail'] = url;
    }

    const reviewEntity = this.travelReviewRepository.create(createInputDto);
    reviewEntity.travelPost = travelPost;
    await this.travelReviewRepository.save(reviewEntity);
  }

  async updateReview(
    userInfo: User,
    id: number,
    updateInputDto: UpdateReviewInputDto,
    thumbnailFile: Express.Multer.File,
  ): Promise<void> {
    const travelReview = await this.getReviewInfo(id);

    const travelPost = travelReview.travelPost;
    const postId = travelPost.id;

    updateInputDto['travelPost'] = travelPost;

    await this.postService.getUserTravelPost(postId, userInfo.id);

    if (thumbnailFile) {
      const url = await this.awsService.updateReviewImage(thumbnailFile, travelReview);
      updateInputDto['thumbnail'] = url;
    }
    const updatedReview = this.travelReviewRepository.merge(travelReview, updateInputDto);
    await this.travelReviewRepository.save(this.travelReviewRepository.create({ ...updatedReview }));
  }

  async getReviewInfo(id: number): Promise<TravelReview> {
    return this.travelReviewRepository.findOne({ where: { id }, relations: ['travelPost'] });
  }

  async deleteReview(userInfo, id) {
    return this.travelReviewRepository.delete({ id });
  }
}

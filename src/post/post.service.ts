import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelPost, UserTravelPost, VisibilityStatus } from 'src/entities';
import { Equal, Repository } from 'typeorm';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { UpdateInputDto } from './dtos/update.dto';
import {
  ForbiddenException,
  NotFoundException,
} from 'src/common/exceptions/service.exception';
import { IPayload } from 'src/jwt/interfaces';
import { EventGateway } from 'src/event/event.gateway';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(TravelPost)
    private readonly travelPostRepository: Repository<TravelPost>,
    @InjectRepository(UserTravelPost)
    private readonly userTravelPostRepository: Repository<UserTravelPost>,
    private readonly eventGateway: EventGateway,
  ) {}

  async getPostById(postId: number): Promise<TravelPost> {
    return this.travelPostRepository.findOne({ where: { id: postId } });
  }

  async getPost(user: IPayload): Promise<TravelPost[]> {
    return this.travelPostRepository.find({
      where: { visibilityStatus: VisibilityStatus.Public },
      relations: ['userTravelPost'],
    });
  }

  async createPost(
    user,
    createInputDto: CreateInputDto,
  ): Promise<CreateOutPutDto> {
    const travelPost: TravelPost = await this.travelPostRepository.save(
      this.travelPostRepository.create(createInputDto),
    );

    await this.userTravelPostRepository.save(
      this.userTravelPostRepository.create({ travelPost, user }),
    );

    return travelPost;
  }

  async updatePost(user: IPayload, id: number, updateInputDto: UpdateInputDto) {
    const userTravelPost = await this.userTravelPostRepository.findOne({
      where: {
        user: { id: user.id },
        travelPost: { id },
      },
      relations: ['travelPost'],
    });

    if (!userTravelPost) {
      throw ForbiddenException('Permission to edit this post is denied.');
    }

    const { travelPost: post } = userTravelPost;

    await this.travelPostRepository.save([
      {
        id,
        ...updateInputDto,
      },
    ]);

    this.eventGateway.notifyPostUpdate(String(id), post);
  }

  async deletePost(user: IPayload, id: number): Promise<void> {
    const userTravelPost = await this.userTravelPostRepository.findOne({
      where: {
        user: { id: user.id },
        travelPost: { id },
      },
      relations: ['travelPost'],
    });

    if (!userTravelPost) {
      throw ForbiddenException('Permission to delete this post is denied.');
    }

    await this.userTravelPostRepository.delete({ id });
  }
}

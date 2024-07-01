import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TravelPost,
  User,
  UserTravelPost,
  VisibilityStatus,
} from 'src/entities';
import { Equal, Repository } from 'typeorm';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { UpdateInputDto } from './dtos/update.dto';
import {
  ForbiddenException,
  NotFoundException,
} from 'src/common/exceptions/service.exception';
import { IPayload } from 'src/jwt/interfaces';
import { EventGateway } from 'src/event/event.gateway';
import { PermissionInputDTO } from './dtos/permission.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(TravelPost)
    private readonly travelPostRepository: Repository<TravelPost>,
    @InjectRepository(UserTravelPost)
    private readonly userTravelPostRepository: Repository<UserTravelPost>,
    private readonly eventGateway: EventGateway,
    private readonly userService: UserService,
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

  async getUserTravelPost(id: number, userId: number): Promise<UserTravelPost> {
    const userTravelPost = await this.userTravelPostRepository.findOne({
      where: {
        user: { id: userId },
        travelPost: { id },
      },
      relations: ['travelPost'],
    });

    if (!userTravelPost) {
      throw ForbiddenException('You do not have permission.');
    }

    return userTravelPost;
  }

  async updatePost(user: IPayload, id: number, updateInputDto: UpdateInputDto) {
    const userTravelPost = await this.getUserTravelPost(id, user.id);

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
    await this.getUserTravelPost(id, user.id);

    await this.userTravelPostRepository.delete({ id });
  }

  async setPermission(
    user: IPayload,
    id: number,
    permissionInputDTO: PermissionInputDTO,
  ) {
    await this.getUserTravelPost(id, user.id);

    const userInfo: User = await this.userService.getUserInfoByEmail(
      permissionInputDTO.email,
    );

    if (!userInfo) {
      throw NotFoundException('No registered user matches the provided email.');
    }
  }
}

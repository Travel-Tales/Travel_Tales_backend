import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelPost, UserTravelPost, VisibilityStatus } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { UpdateInputDto } from './dtos/update.dto';
import { NotFoundException } from 'src/common/exceptions/service.exception';
import { IPayload } from 'src/jwt/interfaces';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(TravelPost)
    private readonly travelPostRepository: Repository<TravelPost>,
    @InjectRepository(UserTravelPost)
    private readonly userTravelPostRepository: Repository<UserTravelPost>,
  ) {}

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
    const travelPost = await this.travelPostRepository.save(
      this.travelPostRepository.create(createInputDto),
    );

    await this.userTravelPostRepository.save(
      this.userTravelPostRepository.create({ travelPost, user }),
    );

    return travelPost;
  }

  async updatePost(id: number, updateInputDto: UpdateInputDto) {
    const post = await this.travelPostRepository.findOne({ where: { id } });

    if (!post) {
      throw NotFoundException('Not found post');
    }

    await this.travelPostRepository.save([
      {
        id,
        ...updateInputDto,
      },
    ]);
  }
}

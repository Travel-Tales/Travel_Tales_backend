import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelPost, UserPost } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { UpdateInputDto } from './dtos/update.dto';
import { NotFoundException } from 'src/common/exceptions/service.exception';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(TravelPost)
    private readonly travelPostRepository: Repository<TravelPost>,
    @InjectRepository(UserPost)
    private readonly userPostRepository: Repository<UserPost>,
  ) {}

  async createPost(
    user,
    createInputDto: CreateInputDto,
  ): Promise<CreateOutPutDto> {
    const post = await this.travelPostRepository.save(
      this.travelPostRepository.create(createInputDto),
    );

    await this.userPostRepository.save(
      this.userPostRepository.create({ post, user }),
    );

    return post;
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

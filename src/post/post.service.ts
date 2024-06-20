import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelPost } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { UpdateInputDto } from './dtos/update.dto';
import { NotFoundException } from 'src/common/exceptions/service.exception';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(TravelPost)
    private readonly travelPostRepository: Repository<TravelPost>,
  ) {}

  async createPost(createInputDto: CreateInputDto): Promise<CreateOutPutDto> {
    return this.travelPostRepository.save(
      this.travelPostRepository.create(createInputDto),
    );
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

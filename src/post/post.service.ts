import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelPost } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInput, CreateOutPut } from './dtos/create.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(TravelPost)
    private readonly travelPostRepository: Repository<TravelPost>,
  ) {}

  async createPost(createInput: CreateInput): Promise<CreateOutPut> {
    return this.travelPostRepository.save(
      this.travelPostRepository.create(createInput),
    );
  }
}

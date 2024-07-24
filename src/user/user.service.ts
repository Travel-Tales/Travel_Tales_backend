import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserLoginType } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { AwsService } from 'src/aws/aws.service';
import {
  UpdateProfileInputDto,
  UpdateProfileOutputDto,
} from './dto/update.profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly awsService: AwsService,
  ) {}

  async getUserInfoByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async createUserInfo(email: string, loginType: UserLoginType): Promise<User> {
    const nickname = email.split('@')[0];
    return await this.userRepository.save(
      this.userRepository.create({ email, loginType, nickname }),
    );
  }

  async getUserInfo(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateProfile(
    user: User,
    updateProfileInputDto: UpdateProfileInputDto,
    file: Express.Multer.File,
  ): Promise<UpdateProfileOutputDto> {
    const imageUrl = await this.awsService.uploadFile(file, user);
    const profileInfo = { ...user, ...updateProfileInputDto, imageUrl };
    return this.userRepository.create(
      await this.userRepository.save([profileInfo]),
    )[0];
  }
}

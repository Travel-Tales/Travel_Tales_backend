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

  async uploadUserProfile(
    file: Express.Multer.File,
    user: User,
  ): Promise<void> {
    if (file.mimetype !== 'image/png') {
    }

    const imageUrl = await this.awsService.uploadFile(file, user);
    await this.userRepository.save({ id: user.id, imageUrl });
  }

  async updateProfile(
    user: User,
    updateProfileInputDto: UpdateProfileInputDto,
  ): Promise<UpdateProfileOutputDto> {
    const profileInfo = { ...user, updateProfileInputDto };
    const [profile] = await this.userRepository.create(
      await this.userRepository.save([profileInfo]),
    );

    return profile;
  }
}

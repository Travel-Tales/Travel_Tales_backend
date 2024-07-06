import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserLoginType } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async generateCode(): Promise<uuidv4> {
    return uuidv4();
  }
}

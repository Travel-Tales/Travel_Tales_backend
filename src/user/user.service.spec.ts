import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { AwsService } from '../aws/aws.service';
import { AwsModule } from '../aws/aws.module';

describe('UserService', () => {
  type mockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

  const mockRepository = () => ({
    delete: jest.fn(),
    findOne: jest.fn(),
  });

  let userService: UserService;
  let userRepository: mockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: AwsService,
          useValue: {
            uploadUserImage: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findUser', () => {
    it('shoud fail if user does not exists', async () => {
      const email = 'test@gmail.com';
      userRepository.findOne.mockResolvedValue(undefined);

      const result = await userService.getUserInfoByEmail(email);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(undefined);
    });
    it('should return user by email', async () => {
      const email = 'test@gamil.com';
      userRepository.findOne.mockResolvedValue(email);

      const result = await userService.getUserInfoByEmail(email);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(email);
    });
  });
});

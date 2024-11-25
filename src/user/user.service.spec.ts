import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/entities';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: mockRepository<UseR>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUser', () => {
    const email = 'indeajhon@gmail.com';

    it('shoud fail if user not exists', () => {
      user;
    });
  });
});
function UserRepository(User: typeof User): string | symbol | Function | import('@nestjs/common').Type<any> {
  throw new Error('Function not implemented.');
}

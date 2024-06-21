import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { User } from 'src/entities';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @Get('/profile')
  async getMyProfile(@Req() req): Promise<User> {
    return this.userService.getUserInfoByEmail(req.user.email);
  }
}

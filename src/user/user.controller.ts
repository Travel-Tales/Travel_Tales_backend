import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { User } from 'src/entities';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저 정보 API',
    description: '유저 정보',
  })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth('Authorization')
  @Get('/profile')
  async getMyProfile(@Req() req): Promise<User> {
    return this.userService.getUserInfoByEmail(req.user.email);
  }
}

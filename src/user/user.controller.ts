import {
  Controller,
  Get,
  Req,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { MyProfileOutputDTO } from './dto/myprofile.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저 정보 API',
    description: '유저 정보',
  })
  @ApiOkResponse({ type: MyProfileOutputDTO })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth('Authorization')
  @Get('/profile')
  async getMyProfile(@Req() req): Promise<MyProfileOutputDTO> {
    return this.userService.getUserInfoByEmail(req.user.email);
  }

  @Post('profile/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<void> {
    return this.userService.uploadUserProfile(file);
  }
}

import {
  Controller,
  Get,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Patch,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/common/decorators/role.decorator';
import { UserInfo } from 'src/common/decorators/userInfo.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { User } from 'src/entities';
import { MyProfileOutputDTO } from './dto/myprofile.dto';
import {
  UpdateProfileInputDto,
  UpdateProfileOutputDto,
} from './dto/update.profile.dto';
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
  async getMyProfile(@UserInfo() userInfo: User): Promise<MyProfileOutputDTO> {
    return this.userService.getUserInfoByEmail(userInfo.email);
  }

  @ApiOperation({
    summary: '유저 프로필 업로드 API',
    description: '유저 프로필 업로드',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth('Authorization')
  @Post('profile/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @UserInfo() userInfo: User,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('File is required and cannot be empty.');
    }

    return this.userService.uploadUserProfile(file, userInfo);
  }

  @ApiOperation({
    summary: '유저 프로필 수정 API',
    description: '유저 프로필 수정',
  })
  @ApiBody({ type: UpdateProfileInputDto })
  @ApiOkResponse({ type: UpdateProfileOutputDto })
  @Role(['Google', 'Kakao'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth('Authorization')
  @Patch('profile')
  async updateProfile(
    @UserInfo() user: User,
    @Body() updateProfileInputDto: UpdateProfileInputDto,
  ): Promise<UpdateProfileOutputDto> {
    return this.userService.updateProfile(user, updateProfileInputDto);
  }
}

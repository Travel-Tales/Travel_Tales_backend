import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadImageInputDTO {
  @ApiProperty({
    description: '이미지 파일',
    type: 'string',
    format: 'binary',
  })
  imageFile?: Express.Multer.File;
}

export class UploadImageOutputDTO {
  @ApiProperty({
    description: '이미지 링크',
    type: 'string',
  })
  imageUrl: string;
}

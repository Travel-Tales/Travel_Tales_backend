// src/utils/aws.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private s3: AWS.S3;

  constructor(@Inject('AWS') private readonly aws: typeof AWS) {
    this.s3 = new this.aws.S3();
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    const params = {
      Bucket: 'traveltales',
      Key: file.originalname,
      Body: file.buffer,
    };

    await this.s3.upload(params).promise();
  }
}

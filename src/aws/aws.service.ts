// src/utils/aws.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { User } from 'src/entities';
import { IBucketOption } from './interfaces';

@Injectable()
export class AwsService {
  private s3: AWS.S3;

  constructor(@Inject('AWS') private readonly aws: typeof AWS) {
    this.s3 = new this.aws.S3();
  }

  async uploadFile(file: Express.Multer.File, profile: User): Promise<string> {
    const params: IBucketOption = {
      Bucket: 'traveltales/images',
      Key: `${new Date().toISOString()}_${profile.email}_profile`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    if (profile.imageUrl) {
      await this.deleteFile(profile.imageUrl);
    }

    return (await this.s3.upload(params).promise()).Location;
  }

  async deleteFile(imageUrl: string): Promise<void> {
    const url: string = decodeURIComponent(imageUrl.split('images/')[1]);

    const params: IBucketOption = {
      Bucket: 'traveltales/images',
      Key: url,
    };

    await this.s3.deleteObject(params).promise();
  }
}

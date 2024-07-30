// src/utils/aws.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { TravelPost, User } from 'src/entities';
import { IBucketOption } from './interfaces';

@Injectable()
export class AwsService {
  private s3: AWS.S3;
  private bucket: string;
  private key: string;

  constructor(@Inject('AWS') private readonly aws: typeof AWS) {
    this.s3 = new this.aws.S3();
  }

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    const params: IBucketOption = {
      Bucket: this.bucket,
      Key: `${new Date().toISOString()}_${this.key}_profile`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return (await this.s3.upload(params).promise()).Location;
  }

  private async deleteFile(imageUrl: string): Promise<void> {
    const url: string = decodeURIComponent(imageUrl.split('images/')[1]);

    const params: IBucketOption = {
      Bucket: this.bucket,
      Key: url,
    };

    await this.s3.deleteObject(params).promise();
  }

  public async uploadUserImage(file: Express.Multer.File, profile: User) {
    this.bucket = 'traveltales/profileImage';
    this.key = profile.email;

    const imageUrl = await this.uploadFile(file);

    if (profile.imageUrl) {
      await this.deleteFile(profile.imageUrl);
    }

    return imageUrl;
  }

  public async uploadPostImage(
    file: Express.Multer.File,
    travelPost: TravelPost,
  ) {
    this.bucket = 'traveltales/thumbnail';
    this.key = `postId_${travelPost.id}`;

    //트랜잭션 걸기 필요
    const imageUrl = await this.uploadFile(file);

    if (travelPost.thumbnail) {
      await this.deleteFile(travelPost.thumbnail);
    }

    return imageUrl;
  }

  public async uploadImageFile(
    imageFile: Express.Multer.File,
  ): Promise<string> {
    this.bucket = 'traveltales/images';
    this.key = imageFile.originalname;

    return this.uploadFile(imageFile);
  }
}

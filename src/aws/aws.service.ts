// src/utils/aws.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { TravelPost, TravelPostImage, User } from 'src/entities';
import { UpdatePostInputDto } from 'src/post/dtos/update.post.dto';
import { Repository } from 'typeorm';
import { IBucketOption } from './interfaces';

@Injectable()
export class AwsService {
  private s3: AWS.S3;
  private bucket: string;
  private key: string;

  constructor(
    @InjectRepository(TravelPostImage)
    private readonly travelPostImageRepository: Repository<TravelPostImage>,
    @Inject('AWS') private readonly aws: typeof AWS,
  ) {
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

  private async deleteFile(imageUrl: string, splitKey: string): Promise<void> {
    const url: string = decodeURIComponent(imageUrl.split(`${splitKey}/`)[1]);
    console.log('🚀 ~ AwsService ~ deleteFile ~ url:', url);

    const params: IBucketOption = {
      Bucket: this.bucket,
      Key: url,
    };

    await this.s3.deleteObject(params).promise();
  }

  public async uploadUserImage(
    ProfileImage: Express.Multer.File,
    profile: User,
  ) {
    this.bucket = 'traveltales/profileImage';
    this.key = profile.email;

    console.log(ProfileImage);

    const imageUrl = await this.uploadFile(ProfileImage);

    if (profile.imageUrl) {
      await this.deleteFile(profile.imageUrl, 'profileImage');
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
      await this.deleteFile(travelPost.thumbnail, 'thumbnail');
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

  public async deleteImageFile(removalList: string[]): Promise<void> {
    this.bucket = 'traveltales/images';

    await Promise.all(removalList.map((ele) => this.deleteFile(ele, 'images')));
  }

  async getPostImageURL(id: number): Promise<TravelPostImage | null> {
    return this.travelPostImageRepository.findOne({
      where: { postId: id },
    });
  }

  async savePostImage(id: number, updatePostInputDto: UpdatePostInputDto) {
    const travelPostImage = await this.getPostImageURL(id);
    const parseImageUrls: string[] = JSON.parse(
      updatePostInputDto?.imageUrl || '[]',
    );

    const removalList: string[] = JSON.parse(
      travelPostImage?.imageUrl || '[]',
    ).filter((ele) => !ele.includes(parseImageUrls));

    await this.deleteImageFile(removalList);

    await this.travelPostImageRepository.save(
      this.travelPostImageRepository.create({
        ...travelPostImage,
        postId: id,
        imageUrl: JSON.stringify(parseImageUrls),
      }),
    );
  }
}

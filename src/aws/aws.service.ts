// src/utils/aws.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { TravelPost, User } from 'src/entities';
import { UpdatePostInputDto } from 'src/post/dtos/update.post.dto';
import { IBucketOption } from './interfaces';
import { FileAttachment } from 'src/entities';
import { Repository, Equal } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class AwsService {
  private s3: AWS.S3;

  constructor(
    @InjectRepository(FileAttachment)
    private readonly fileAttachmentRepository: Repository<FileAttachment>,
    @Inject('AWS') private readonly aws: typeof AWS,
  ) {
    this.s3 = new this.aws.S3();
  }

  private generateHash(fileName: string): string {
    const date = new Date().toISOString();
    return crypto.createHash('sha256').update(`${fileName}-${date}`).digest('hex');
  }

  private async uploadFile(bucket: string, file: Express.Multer.File): Promise<{ url: string; hashName: string }> {
    const hashName = `${this.generateHash(file.originalname)}.${file.originalname.split('.').pop()}`;
    const params: IBucketOption = {
      Bucket: bucket,
      Key: hashName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const url = (await this.s3.upload(params).promise()).Location;
    return { url, hashName };
  }

  private async saveFileAttachment(
    bucket: string,
    file: Express.Multer.File,
    url: string,
    hashName: string,
    fileType: string,
    id: number,
  ): Promise<FileAttachment> {
    return this.fileAttachmentRepository.save(
      this.fileAttachmentRepository.create({
        tableId: id,
        bucket,
        originalName: file.originalname,
        hashName,
        mimeType: file.mimetype,
        size: file.size,
        fileType: fileType,
        url,
      }),
    );
  }

  private async deleteFile(bucket: string, imageUrl: string, fileType: string): Promise<void> {
    const url: string = decodeURIComponent(imageUrl.split(`${fileType}/`)[1]);

    const params: IBucketOption = {
      Bucket: bucket,
      Key: url,
    };

    await this.s3.deleteObject(params).promise();
  }

  public async uploadUserImage(ProfileImageFile: Express.Multer.File, profile: User): Promise<string> {
    const bucket = 'traveltales/profileImage';
    const fileType = 'profileImage';
    const fileInfo = await this.uploadFile(bucket, ProfileImageFile);

    if (profile.imageUrl) {
      await this.deleteFile(bucket, profile.imageUrl, fileType);
    }

    return fileInfo.url;
  }

  public async uploadPostImage(file: Express.Multer.File, travelPost: TravelPost): Promise<string> {
    const bucket = 'traveltales/thumbnail';
    const fileType = 'thumbnail';
    //트랜잭션 걸기 필요
    const { url } = await this.uploadFile(bucket, file);

    if (travelPost.thumbnail) {
      await this.deleteFile(bucket, travelPost.thumbnail, fileType);
    }

    return url;
  }

  public async uploadImageFile(id: number, imageFile: Express.Multer.File, fileType: string): Promise<FileAttachment> {
    const bucket = 'traveltales/images';

    const { url, hashName } = await this.uploadFile(bucket, imageFile);
    return this.saveFileAttachment(bucket, imageFile, url, hashName, fileType, id);
  }

  async getPostImages(id: number): Promise<FileAttachment[] | null> {
    return this.fileAttachmentRepository.find({ where: { tableId: id } });
  }

  async savePostImage(id: number, updatePostInputDto: UpdatePostInputDto) {
    const travelPostImage = await this.getPostImages(id);
    const parseImageUrlList: string[] = JSON.parse(updatePostInputDto?.imageUrl || '[]');
    const bucket = 'traveltales/images';

    const fileType = 'postImage';

    const removalList: FileAttachment[] = travelPostImage.filter((ele) => !parseImageUrlList.includes(ele.hashName));

    await Promise.all(
      removalList.map((ele) => {
        this.deleteFile(bucket, ele.url, fileType);
        this.fileAttachmentRepository.delete({ id: ele.id });
      }),
    );
  }
}

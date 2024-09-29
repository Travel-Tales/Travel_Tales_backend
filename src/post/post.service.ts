import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TravelPost,
  UserTravelPost,
  VisibilityStatus,
  InvitationVerification,
  User,
  FileAttachment,
} from 'src/entities';
import { Like, Repository } from 'typeorm';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { UpdatePostInputDto } from './dtos/update.post.dto';
import { ForbiddenException, NotFoundException } from 'src/common/exceptions/service.exception';
import { EventGateway } from 'src/event/event.gateway';
import { PermissionInputDTO } from './dtos/permission.dto';
import { MailService } from 'src/mail/mail.service';
import { AwsService } from 'src/aws/aws.service';
import { PostQueryStringDTO } from './dtos/get.query';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(TravelPost)
    private readonly travelPostRepository: Repository<TravelPost>,
    @InjectRepository(UserTravelPost)
    private readonly userTravelPostRepository: Repository<UserTravelPost>,
    @InjectRepository(InvitationVerification)
    private readonly invitationRepository: Repository<InvitationVerification>,
    @InjectRepository(FileAttachment)
    private readonly fileAttchmentRepository: Repository<FileAttachment>,
    private readonly eventGateway: EventGateway,
    private readonly mailService: MailService,
    private readonly awsService: AwsService,
  ) {}

  async getPost(
    id?: number,
    query?: PostQueryStringDTO,
    visibilityStatus?: VisibilityStatus,
  ): Promise<TravelPost | TravelPost[]> {
    const where = {};

    if (id) {
      where['id'] = id;
    }

    if (visibilityStatus) {
      where['visibilityStatus'] = visibilityStatus;
    }

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        where[key] = Like(`%${value}%`);
      });
    }

    return this.travelPostRepository.find({
      where,
    });
  }

  async getPostWithAccess(id: number, user?: User): Promise<TravelPost | TravelPost[]> {
    const post = await this.getPost(id);

    if (!post) {
      throw NotFoundException('Not found post');
    }

    await this.getUserTravelPost(id, user?.id);

    return post;
  }

  async getRecommendPost(): Promise<TravelPost[]> {
    return this.travelPostRepository
      .createQueryBuilder('tp')
      .where(`tp.visibilityStatus = 'Public'`)
      .orderBy('RANDOM()')
      .limit(8)
      .getMany();
  }

  async createPost(user, createInputDto: CreateInputDto): Promise<CreateOutPutDto> {
    const travelPost: TravelPost = await this.travelPostRepository.save(
      this.travelPostRepository.create(createInputDto),
    );

    await this.userTravelPostRepository.save(this.userTravelPostRepository.create({ travelPost, user }));

    return travelPost;
  }

  async getUserTravelPost(id: number, userId?: number): Promise<UserTravelPost> {
    const where = {
      travelPost: { id },
    };
    if (userId) {
      where['user'] = { id: userId };
    }
    const userTravelPost = await this.userTravelPostRepository.findOne({
      where,
    });

    if (!userTravelPost) {
      throw ForbiddenException('You do not have permission.');
    }

    return userTravelPost;
  }

  async updatePost(
    user: User,
    id: number,
    updateInputDto: UpdatePostInputDto,
    thumbnailFile: Express.Multer.File,
  ): Promise<void> {
    await this.getUserTravelPost(id, user.id);

    const travelPost = (await this.getPost(id)) as TravelPost;

    const travelPostInfo = {
      id,
      ...updateInputDto,
    };

    if (thumbnailFile) {
      const thumbnail = await this.awsService.uploadPostImage(thumbnailFile, travelPost);
      travelPostInfo['thumbnail'] = thumbnail;
    }

    await Promise.all([
      this.awsService.savePostImage(id, updateInputDto),
      this.travelPostRepository.save([this.travelPostRepository.create(travelPostInfo)]),
    ]);

    const post: TravelPost = (await this.getPost(id)) as TravelPost;

    await this.eventGateway.notifyPostUpdate(String(id), post);
  }

  async deletePost(user: User, id: number): Promise<void> {
    await this.getUserTravelPost(id, user.id);
    await this.fileAttchmentRepository.delete({ tableId: id });
    await this.travelPostRepository.delete({ id });
  }

  async setPermission(user: User, id: number, permissionInputDTO: PermissionInputDTO) {
    const post = await this.getUserTravelPost(id, user.id);
    const { email } = permissionInputDTO;

    const invitation: InvitationVerification = await this.invitationRepository.create({ email, postId: id });
    invitation.createCode();

    await this.invitationRepository.upsert(invitation, ['email', 'postId']);

    const { title } = post.travelPost;
    await this.mailService.sendMail(user.nickname, email, title);
  }

  async getMyPost(userInfo: User, query?: PostQueryStringDTO): Promise<TravelPost[]> {
    const travelPostList = await this.travelPostRepository
      .createQueryBuilder('tp')
      .innerJoinAndSelect('tp.userTravelPost', 'utp')
      .select(['tp'])
      .where('utp.userId = :userId', { userId: userInfo.id });

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        travelPostList.andWhere(`tp.${key} LIKE :${key}`, {
          [key]: `%${value}%`,
        });
      });
    }
    travelPostList.orderBy('tp.createdAt', 'ASC');
    return travelPostList.getMany();
  }

  async uploadImageFile(id: number, imageFile: Express.Multer.File): Promise<string> {
    const fileType = 'postImage';
    const S3FileInfo: FileAttachment = await this.awsService.uploadImageFile(id, imageFile, fileType);

    return S3FileInfo.url;
  }
}

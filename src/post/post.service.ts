import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TravelPost,
  UserTravelPost,
  VisibilityStatus,
  InvitationVerification,
  User,
} from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInputDto, CreateOutPutDto } from './dtos/create.dto';
import { UpdateInputDto } from './dtos/update.dto';
import { ForbiddenException } from 'src/common/exceptions/service.exception';
import { EventGateway } from 'src/event/event.gateway';
import { PermissionInputDTO } from './dtos/permission.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(TravelPost)
    private readonly travelPostRepository: Repository<TravelPost>,
    @InjectRepository(UserTravelPost)
    private readonly userTravelPostRepository: Repository<UserTravelPost>,
    @InjectRepository(InvitationVerification)
    private readonly InvitationRepository: Repository<InvitationVerification>,
    private readonly eventGateway: EventGateway,
    private readonly mailService: MailService,
  ) {}

  async getPost(id: number | undefined): Promise<TravelPost | TravelPost[]> {
    const where = id ? { id } : { visibilityStatus: VisibilityStatus.Public };
    return this.travelPostRepository.find({ where });
  }

  async createPost(
    user,
    createInputDto: CreateInputDto,
  ): Promise<CreateOutPutDto> {
    const travelPost: TravelPost = await this.travelPostRepository.save(
      this.travelPostRepository.create(createInputDto),
    );

    await this.userTravelPostRepository.save(
      this.userTravelPostRepository.create({ travelPost, user }),
    );

    return travelPost;
  }

  async getUserTravelPost(id: number, userId: number): Promise<UserTravelPost> {
    const userTravelPost = await this.userTravelPostRepository.findOne({
      where: {
        user: { id: userId },
        travelPost: { id },
      },
    });

    if (!userTravelPost) {
      throw ForbiddenException('You do not have permission.');
    }

    return userTravelPost;
  }

  async updatePost(user: User, id: number, updateInputDto: UpdateInputDto) {
    const userTravelPost = await this.getUserTravelPost(id, user.id);

    const { travelPost: post } = userTravelPost;

    await this.travelPostRepository.save([
      {
        id,
        ...updateInputDto,
      },
    ]);

    this.eventGateway.notifyPostUpdate(String(id), post);
  }

  async deletePost(user: User, id: number): Promise<void> {
    await this.getUserTravelPost(id, user.id);
    await this.travelPostRepository.delete({ id });
  }

  async setPermission(
    user: User,
    id: number,
    permissionInputDTO: PermissionInputDTO,
  ) {
    const post = await this.getUserTravelPost(id, user.id);
    const { email } = permissionInputDTO;

    const invitation: InvitationVerification =
      await this.InvitationRepository.create({ email, postId: id });
    invitation.createCode();

    await this.InvitationRepository.upsert(invitation, ['email', 'postId']);

    const { title } = post.travelPost;
    // await this.mailService.sendMail(user.nickname, email, title);
  }
}

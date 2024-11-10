import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelPost, UserTravelPost, InvitationVerification, FileAttachment } from '../entities';
import { EventModule } from '../event/event.module';
import { MailModule } from '../mail/mail.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelPost, UserTravelPost, InvitationVerification, FileAttachment]),
    EventModule,
    MailModule,
    AwsModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}

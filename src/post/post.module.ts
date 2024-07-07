import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TravelPost,
  UserTravelPost,
  InvitationVerification,
} from 'src/entities';
import { EventModule } from 'src/event/event.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TravelPost,
      UserTravelPost,
      InvitationVerification,
    ]),
    EventModule,
    MailModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}

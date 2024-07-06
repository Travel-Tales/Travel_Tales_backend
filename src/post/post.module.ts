import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelPost, UserTravelPost } from 'src/entities';
import { EventGateway } from 'src/event/event.gateway';
import { EventModule } from 'src/event/event.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelPost, UserTravelPost]),
    EventModule,
    UserModule,
    MailModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}

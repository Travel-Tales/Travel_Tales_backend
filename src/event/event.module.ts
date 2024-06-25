import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventGateway } from './event.gateway';
import { PostModule } from 'src/post/post.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [JwtModule],
  providers: [EventGateway, EventService],
  exports: [EventGateway],
})
export class EventModule {}

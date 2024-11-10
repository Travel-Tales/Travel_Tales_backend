import { Injectable } from '@nestjs/common';
import { NotFoundException } from '../common/exceptions/service.exception';
import { PostService } from '../post/post.service';
import { Socket } from 'socket.io';

@Injectable()
export class EventService {
  constructor() {}

  async joinRoom(postId: number, client: Socket) {
    // const post = await this.postService.getPostById(+postId);

    // if (!post) {
    //   throw NotFoundException('Post Not Found');
    // }

    client.join(`${postId}`);
  }

  async leaveRoom(postId: number, client: Socket) {
    const isJoin = client.rooms.has(`${postId}`);

    if (!isJoin) {
      throw NotFoundException('You are not joined in this room');
    }
  }
}

import { EventService } from './event.service';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ForbiddenException } from 'src/common/exceptions/service.exception';
import { JwtService } from 'src/jwt/jwt.service';
import { IPayload } from 'src/jwt/interfaces';
import { TravelPost } from 'src/entities';

@WebSocketGateway({
  namespace: 'post',
  transports: ['websocket', 'polling'],
  cors: { origin: '*' },
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly gatewayService: EventService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    server.use((client: Socket, next) => {
      try {
        const token = client.handshake.headers['authorization'];
        if (!token) {
          throw ForbiddenException();
        }

        const user: IPayload = this.jwtService.verifyAccessToken(
          token.split(' ')[1],
        );
        client.data.user = user;

        next();
      } catch (e) {
        next(e);
      }
    });
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('postId') postId,
  ) {
    return this.gatewayService.joinRoom(postId, client);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('postId') postId,
  ) {
    return this.gatewayService.leaveRoom(postId, client);
  }

  @SubscribeMessage('updatePost')
  handleUpdatePost(
    @MessageBody() data: { postId: string; content: TravelPost },
  ) {
    const { postId, content } = data;
    this.server.to(postId).emit('postUpdated', content);
  }

  public notifyPostUpdate(postId: string, content: TravelPost) {
    this.server.to(postId).emit('postUpdated', content);
  }
}

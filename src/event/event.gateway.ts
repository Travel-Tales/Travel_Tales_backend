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
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'post',
  transports: ['websocket'],
  cors: { origin: '*' },
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger('EventGateway');

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
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('postId') postId,
  ) {
    console.log('hi');
    return this.gatewayService.joinRoom(postId, client);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('postId') postId,
  ) {
    return this.gatewayService.leaveRoom(postId, client);
  }

  public notifyPostUpdate(postId: string, content: TravelPost) {
    this.server.to(postId).emit('postUpdated', content);
  }
}

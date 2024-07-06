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

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: EventService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
  }

  @SubscribeMessage('setInit')
  handleSetInit(client: Socket) {
    try {
      const token = client.handshake.auth.Authorization;
      if (!token) {
        throw new Error();
      }

      const user: IPayload = this.jwtService.verifyAccessToken(
        token.split(' ')[1],
      );
      client.data.user = user;
      client.emit('setInitSuccess', { message: 'Initialization successful' });
    } catch (e) {
      client.emit('error', { message: 'Invalid Token' });
      client.disconnect();
    }
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
    console.log('🚀 ~ notifyPostUpdate ~ content:', content);
    this.server.to(postId).emit('postUpdate', content);
  }
}

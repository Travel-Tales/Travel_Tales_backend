import { EventService } from './event.service';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/post',
  transports: ['websocket', 'polling'],
  cors: { origin: '*' },
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  server: Server;
  constructor(private readonly gatewayService: EventService) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() postId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(postId);
    console.log(`Client ${client.id} joined room ${postId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() postId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(postId);
    console.log(`Client ${client.id} left room ${postId}`);
  }

  @SubscribeMessage('updatePost')
  handleUpdatePost(@MessageBody() data: { postId: string; content: any }) {
    const { postId, content } = data;
    this.server.to(postId).emit('postUpdated', content);
    console.log(`Post ${postId} updated with content:`, content);
  }
}

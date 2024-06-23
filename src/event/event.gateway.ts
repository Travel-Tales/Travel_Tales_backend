import { EventService } from './event.service';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'post' })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  server: Server;
  constructor(private readonly gatewayService: EventService) {}

  afterInit(server: Server) {
    console.log('websocketserver init');
    this.server = server;
  }

  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}
}

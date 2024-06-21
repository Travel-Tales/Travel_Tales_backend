import { GatewayService } from './gateway.service';
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
export class GateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  server: Server;
  constructor(private readonly gatewayService: GatewayService) {}

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}
}

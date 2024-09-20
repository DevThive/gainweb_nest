import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private rooms: { [key: string]: string[] } = {}; // 방 관리

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    if (!this.rooms[room]) {
      this.rooms[room] = [];
    }
    this.rooms[room].push(client.id);
    console.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('chatMessage')
  handleMessage(
    @MessageBody() data: { room: string; message: string; user: string },
  ) {
    this.server.to(data.room).emit('chatMessage', {
      user: data.user,
      message: data.message,
    });
  }
}

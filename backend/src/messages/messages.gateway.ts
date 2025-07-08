import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private messagesService: MessagesService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(userId.toString());
      console.log(`User ${userId} connected with socket ID ${client.id}`);
      await this.messagesService.setUserOnline(userId.toString());
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
    const userId = client.handshake.query.userId;
    if (userId) {
      await this.messagesService.setUserOffline(userId.toString());
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    let payload: MessageDto;
    if (typeof data === 'string') {
      try {
        payload = JSON.parse(data);
      } catch (error) {
        throw new WsException('Invalid JSON format in message');
      }
    } else {
      payload = data;
    }

    // set senderId from client query
    const senderId = Number(client.handshake.query.userId);

    // Save message to database
    const savedMessage = await this.messagesService.create(payload, senderId);

    // Cache unread
    await this.messagesService.cacheUnreadMessages(senderId, payload.recipientId, savedMessage);

    // Emit to recipient
    this.server.to(payload.recipientId.toString()).emit('newMessage', savedMessage);

    // Emit confirmation to sender
    client.emit('messageSent', savedMessage);

    return savedMessage;
  }
}

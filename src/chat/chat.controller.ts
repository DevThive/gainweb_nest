import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send-message')
  async sendMessage(
    @Body() message: { category: string; content: string; user: string },
  ) {
    return this.chatService.sendMessage(
      message.category,
      message.content,
      message.user,
    );
  }

  @Get(':category')
  async getMessages(@Param('category') category: string) {
    return this.chatService.getMessages(category);
  }
}

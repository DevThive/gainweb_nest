import { Module, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis/redis/redis.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, RedisService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    await this.redisService.testConnection(); // Redis 연결 테스트 호출
  }
}

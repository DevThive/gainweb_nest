import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis/redis.service';

@Injectable()
export class ChatService {
  constructor(private readonly redisService: RedisService) {}

  async sendMessage(category: string, content: string, user: string) {
    const message = {
      category,
      content,
      user,
      timestamp: new Date().toISOString(),
    };

    const key = `chat:${category}`;

    try {
      await this.redisService.getClient().lpush(key, JSON.stringify(message));
      await this.redisService.getClient().expire(key, 10800); // TTL 3시간 설정
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
      throw new Error('메시지를 전송할 수 없습니다.');
    }

    return message;
  }

  async getMessages(category: string) {
    const key = `chat:${category}`;

    try {
      const messages = await this.redisService.getClient().lrange(key, 0, -1);

      if (!messages || messages.length === 0) {
        return [];
      }

      return messages.map((msg) => JSON.parse(msg)).reverse();
    } catch (error) {
      console.error('메시지 불러오기 중 오류 발생:', error);
      throw new Error('메시지를 불러올 수 없습니다.');
    }
  }

  async getNewMessages(category: string, lastMessageTimestamp: Date) {
    const key = `chat:${category}`;

    try {
      const messages = await this.redisService.getClient().lrange(key, 0, -1);

      if (!messages || messages.length === 0) {
        return [];
      }

      const newMessages = messages
        .map((msg) => JSON.parse(msg))
        .filter((msg) => new Date(msg.timestamp) > lastMessageTimestamp)
        .reverse(); // 새로운 메시지를 역순으로 반환

      return newMessages;
    } catch (error) {
      console.error('새로운 메시지 불러오기 중 오류 발생:', error);
      throw new Error('새로운 메시지를 불러올 수 없습니다.');
    }
  }
}

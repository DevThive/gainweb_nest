import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis/redis.service';

@Injectable()
export class ChatService {
  constructor(private readonly redisService: RedisService) {}

  async sendMessage(category: string, content: string, user: string) {
    const message = {
      category,
      content,
      user, // 사용자 정보를 매개변수로 받아 저장
      timestamp: new Date().toISOString(),
    };

    const key = `chat:${category}`;

    try {
      await this.redisService.getClient().lpush(key, JSON.stringify(message)); // 메시지를 리스트에 추가
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
      // 리스트에서 모든 메시지를 가져옵니다.
      const messages = await this.redisService.getClient().lrange(key, 0, -1);

      // 메시지가 없으면 빈 배열 반환
      if (!messages || messages.length === 0) {
        return [];
      }

      // JSON 파싱하여 배열로 반환 후 역순으로 정렬
      return messages.map((msg) => JSON.parse(msg)).reverse(); // 역순으로 정렬
    } catch (error) {
      console.error('메시지 불러오기 중 오류 발생:', error);
      throw new Error('메시지를 불러올 수 없습니다.');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async set(key: string, value: string, ttl: number) {
    await this.redisClient.set(key, value, 'EX', ttl);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }

  async testConnection() {
    try {
      const testKey = 'test:key';
      const testValue = 'Hello, Redis!';
      await this.set(testKey, testValue, 60); // 1분 TTL 설정
      const value = await this.get(testKey);

      if (value === testValue) {
        console.log('Redis 연결 성공:', value);
      } else {
        console.error('Redis 연결 실패: 저장된 값이 다릅니다.');
      }

      await this.del(testKey); // 테스트 후 키 삭제
    } catch (error) {
      console.error('Redis 연결 테스트 중 오류 발생:', error);
    }
  }
}

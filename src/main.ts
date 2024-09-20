import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config(); // .env 파일에서 환경 변수 로드

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3000', // 허용할 출처 (클라이언트 주소)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 쿠키 및 인증 정보를 포함한 요청 허용
  });

  await app.listen(4000);
}
bootstrap();

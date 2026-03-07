import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Aktifkan CORS agar frontend (Nuxt) bisa memanggil API backend
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

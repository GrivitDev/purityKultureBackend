import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // adjust to frontend URL
    credentials: true,
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

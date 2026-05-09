import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 安全头
  app.use(helmet());

  // CORS 配置
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // 速率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 分钟
      max: 100, // 最多 100 个请求
      message: '请求过于频繁，请稍后再试',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('库存管理系统 API')
    .setDescription('小型制造企业库存管理系统接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // 生产环境不暴露 Swagger
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Swagger docs at http://localhost:${port}/api/docs`);
  }
}
bootstrap();
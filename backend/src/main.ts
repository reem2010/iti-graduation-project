import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Polyfill for crypto.randomUUID if not available
if (!(global as any).crypto?.randomUUID) {
  (global as any).crypto = {
    ...(global as any).crypto,
    randomUUID: () => crypto.randomUUID(),
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Siraj Docs')
    .setDescription('API Documentation for Siraj')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prepare allowed origins for CORS
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

  if (process.env.FRONT_URL) {
    allowedOrigins.push(process.env.FRONT_URL);
  }

  console.log('Allowed Origins for CORS:', allowedOrigins);

  // Enable CORS with credentials
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Start the application
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();

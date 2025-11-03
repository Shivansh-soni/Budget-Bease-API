import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { InternalDisabledLogger } from './utils/newLogger';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new InternalDisabledLogger(),
  });

  // Enable CORS with appropriate options
  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend URL
      'http://localhost:5001', // Backend URL (for development)
      'https://accounts.google.com', // Google OAuth
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Required for cookies, authorization headers with HTTPS
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Parse cookies
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip away any properties that don't have any decorators
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
      transformOptions: {
        enableImplicitConversion: true, // Convert string query parameters to their corresponding types
      },
    }),
  );

  const PORT = process.env.PORT || 5001;
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

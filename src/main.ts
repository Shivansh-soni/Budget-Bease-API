import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { InternalDisabledLogger } from './utils/newLogger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe as CustomValidationPipe } from './common/pipes/validation.pipe';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new InternalDisabledLogger(),
    cors: true,
  });

  // Security middlewares
  app.use(helmet());
  app.use(compression());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Global prefix for API versioning
  app.setGlobalPrefix('api/v1');

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Budget Beast API')
    .setDescription(
      'Comprehensive API for Budget Beast - Personal and Group Finance Management',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:5001', 'Development Server')
    .addServer('https://bb-api.kalakr.in', 'Production Server')
    .setContact(
      'Support Team',
      'https://kalakr.in/support',
      'support@budgetbeast.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
    },
  });

  // Enable CORS with appropriate options
  app.enableCors({
    origin: [
      'http://localhost:3000', // Local frontend
      'http://localhost:5001', // Local backend
      'https://budgetbeast.com', // Production frontend
      'https://app.budgetbeast.com', // Production app
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  // Parse cookies
  app.use(cookieParser());

  // Global pipes, filters, and interceptors
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ApiResponseInterceptor(),
  );

  const PORT = process.env.PORT || 5001;
  await app.listen(PORT, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`API Documentation available at: ${await app.getUrl()}/api/docs`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', err);
  process.exit(1);
});

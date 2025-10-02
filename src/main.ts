import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConsoleLogger } from '@nestjs/common';
import { InternalDisabledLogger } from './utils/newLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new InternalDisabledLogger(),
  });

  // const app = await NestFactory.create(AppModule, {
  //   logger: new ConsoleLogger({
  //     json: true,
  //   }),
  // });
  const PORT = process.env.PORT || 5001;
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logging/interceptors/logging.interceptor';
import { LogService } from './logging/log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const logService = app.get(LogService);
  app.useGlobalInterceptors(new LoggingInterceptor(logService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

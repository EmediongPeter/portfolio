import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // global routing format
  app.setGlobalPrefix('/api/v1/', {});
  
  // Implementing helmet middleware
  //  app.use(helmet());

  // validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Adding swagger documentations to the app
  SwaggerModule.setup('/api/v1/docs', app, createDocument(app));

  await app.listen(8000);
}
bootstrap();

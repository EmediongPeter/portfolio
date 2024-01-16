import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // SwaggerModule.setup('api/v1', app, createDocument(app));
  const config = new DocumentBuilder()
    .setTitle('ToDo App')
    .setDescription('The Todo API description')
    .setVersion('1.0')
    .addTag('Todos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);
  // app.use(passport.initialize());
  await app.listen(3005);
  console.info('Up and running');
}
bootstrap();

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

//Imports
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './system/resources/tasks/todos.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './helpers/exceptions/http.exception.filter';
import { CategoryModule } from './system/resources/tasks/module/category.module';

@Module({
  // imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest_auth')],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    TodosModule,
    CategoryModule
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryController } from '../controllers/category.controller';
import { CategoryService } from '../services/category.service';
import { Category, CategorySchema } from '../entities/category.schema';
import { JwtModule } from '@nestjs/jwt';

//Imports

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

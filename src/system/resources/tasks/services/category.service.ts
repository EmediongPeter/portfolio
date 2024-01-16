import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../entities/category.schema';
import { Model } from 'mongoose';
import { ServiceException } from 'src/helpers/exceptions/service.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategorySchema: Model<Category>,
  ) {}
  addCategory(data, user) {
    console.log({...data, user: user})
    return this.CategorySchema.findOneAndUpdate(
      { ...data, user: user },
      { ...data, user: user },
      { new: true, upsert: true, runValidators: true },
    ).catch((e) => {
      throw new ServiceException({message: 'Error: Unable to create category', status: 400})
    })
  }
}

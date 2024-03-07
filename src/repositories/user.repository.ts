import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/User';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly UserSchema: Model<User>,
  ) {}

  async find(query: any) {
    return await this.UserSchema.find(query);
  }

  async findOne(query: any) {
    return this.UserSchema.findOne(query);
  }

  async create(data: Record<string, any>) {
    const user = new this.UserSchema(data);
    // await user.save();
    return user;
  }

  async updateOne(query: any, data: Record<string, any>) {
    return await this.UserSchema.findOneAndUpdate(query, data, { new: true });
  }

  async findById(id: string) {
    return await this.UserSchema.findById({ _id: id });
  }
}

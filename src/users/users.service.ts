import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { UpdateProfileDto } from './dto/update-user.dto';
import { IUserProfile } from './interfaces/users.interface';
import {
  ExceptionFilter,
  ServiceException,
} from 'src/helpers/exceptions/service.exception';
import { parseDBError } from 'src/helpers/main';
import { CloudinaryService } from 'src/system/resources/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserSchema: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async updateProfile(
    id: Types.ObjectId,
    data: UpdateProfileDto,
  ): Promise<IUserProfile> {
    try {
      let user = await this.UserSchema.findOne({ _id: id });

      user = await this.UserSchema.findOneAndUpdate(
        { _id: user.id },
        { $set: data },
        { new: true, runValidators: true },
      );

      const userProfile: IUserProfile = {
        email: user.email,
        id: user._id,
        fullname: user.fullname,
        phone: user.phone,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        occupation: user.occupation,
      };

      return userProfile;
    } catch (error) {
      console.log(error);
      throw new ServiceException(error);
    }
  }

  async updatePicture(id: Types.ObjectId, file: Array<Express.Multer.File>) {
    let data: UpdateProfileDto;

    try {
      if (file) {
        const url = await this.cloudinaryService
          .uploadFile(file)
          .catch((e) => {
            throw new ServiceException({
              message: 'Unable to upload file to cloud',
              status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
            });
          });

        data.avatar = url.secure_url;
        data.cloudId = url.public_id;
      }

      let user = await this.UserSchema.findOne({ _id: id });

      user = await this.UserSchema.findOneAndUpdate(
        { _id: user.id },
        { $set: data },
        { new: true, runValidators: true },
      );

      return user;
    } catch (e) {
      console.log(e)
      throw new ServiceException(e);
    }
  }

  async deleteProfile() {}
  async getProfile() {}
  async getUsers() {}
}

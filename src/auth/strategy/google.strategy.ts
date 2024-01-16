import { OAuth2Client } from 'google-auth-library';
import { User, UserDocument } from '../schema/auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth.service';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

export class GoogleAuthStrategy {
  constructor(
    @InjectModel(User.name) private UserSchema: Model<UserDocument>,
    private authService: AuthService,
  ) {}
  async validate(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      // log the ticket payload in the console to see what we have
      console.log(ticket.getPayload());
      const data = ticket.getPayload();

      let user = await this.UserSchema.findOne({ email: data.email });

      if (!user) {
        user = new this.UserSchema({
          email: data.email,
          fullname: data.name,
          avatar: data.picture,
        });

        await user.save();
        return this.authService.signUser(user);
      }

      return this.authService.signUser(user);
    } catch (error) {}
  }
}

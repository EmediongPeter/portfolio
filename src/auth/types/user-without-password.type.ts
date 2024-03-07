import { OmitType } from '@nestjs/swagger';
import { User, UserDocument } from '../../schemas/User';
/** This entity is the same as
 * <a href="User.html">User</a>
 * but <u>omitting the password field</u>
 */
export class UserWithoutPassword extends OmitType(User, ['password', 'refreshToken'] as const) {
  
}

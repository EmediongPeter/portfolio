import { AuthServiceInputException } from "./auth-service.exception";

/** Used when the user inputs an invalid token
 * when refreshing
 */
export class InvalidRefreshTokenException extends AuthServiceInputException {
  /** Throws exception with message 'Invalid refresh token'.
   *
   * Used when the user inputs an invalid token
   * when refreshing
   */
  constructor() {
    super('Invalid refresh token');
  }
}

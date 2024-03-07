/** Describes the response received when the Login route is successfully called */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
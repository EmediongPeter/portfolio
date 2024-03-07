import { compare, genSalt, hash,  } from 'bcrypt';
export const generateHashData = async (
  data: string,
): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(data, salt);
};

export const compareData = async (
  data: string,
  hashedData: string,
): Promise<boolean> => {
  return await compare(data, hashedData);
};

export const decodeData = async (refreshToken: string) => {
  return
}

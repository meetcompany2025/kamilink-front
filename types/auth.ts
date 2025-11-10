import { UserProfile } from './user';

export type LoginDto = {
  email?: string;
  password: string;
  phone?: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
  profile?: UserProfile;
  phone?: string;
};

export type AuthResponse = {
  token: string;
};

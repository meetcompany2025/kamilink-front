export type UserProfile = 'CLIENT' | 'TRANSPORTER' | 'ADMIN';

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  profile?: UserProfile;
  phone?: string;
  documentType: string;
  documentNumber: string;
  provincia: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  documentType: string;
  documentNumber: string;
  isActive: boolean;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

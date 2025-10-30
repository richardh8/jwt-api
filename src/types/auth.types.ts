export interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

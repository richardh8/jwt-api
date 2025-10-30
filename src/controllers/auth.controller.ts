import bcrypt from 'bcrypt';
import { LoginDto, RegisterDto, User, AuthResponse } from '../types/auth.types.js';
import { generateToken } from '../utils/jwt.js';

// In-memory user storage (for demo purposes)
const users: User[] = [
  {
    id: 1,
    username: 'admin',
    // Password: admin123
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'admin' as const,
  },
];

class AuthController {
  async login(loginData: LoginDto): Promise<AuthResponse> {
    const user = users.find(u => u.username === loginData.username);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword,
    };
  }

  async register(registerData: RegisterDto): Promise<AuthResponse> {
    const existingUser = users.find(u => u.username === registerData.username);
    
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const newUser: User = {
      id: users.length + 1,
      username: registerData.username,
      password: hashedPassword,
      role: registerData.role || 'user',
    };

    users.push(newUser);

    const token = generateToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;
    
    return {
      token,
      user: userWithoutPassword,
    };
  }
}

export const authController = new AuthController();

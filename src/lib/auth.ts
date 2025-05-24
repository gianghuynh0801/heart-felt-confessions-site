
import bcrypt from 'bcryptjs';
import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: Date;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const { data: existingUsers, error: checkError } = await api.get<User[]>(`/profiles?email=eq.${email}`);
      
      if (checkError) {
        return { user: null, error: 'Failed to check existing user' };
      }

      if (existingUsers && existingUsers.length > 0) {
        return { user: null, error: 'User already exists with this email' };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userData = {
        email,
        password_hash: hashedPassword,
        name,
        role: 'user',
        created_at: new Date().toISOString()
      };

      const { data: users, error: createError } = await api.post<User[]>('/profiles', userData);

      if (createError || !users || users.length === 0) {
        return { user: null, error: 'Failed to create account' };
      }

      const user = users[0];
      return { user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: 'Failed to create account' };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: users, error: fetchError } = await api.get<(User & { password_hash: string })[]>(
        `/profiles?email=eq.${email}`
      );

      if (fetchError) {
        return { user: null, error: 'Failed to sign in' };
      }

      if (!users || users.length === 0) {
        return { user: null, error: 'Invalid email or password' };
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { user: null, error: 'Failed to sign in' };
    }
  },

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const { data: users, error } = await api.get<User[]>(`/profiles?id=eq.${userId}`);

      if (error || !users || users.length === 0) {
        return null;
      }

      return users[0];
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
};

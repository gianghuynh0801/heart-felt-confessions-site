
import bcrypt from 'bcryptjs';
import db from './database';

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
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return { user: null, error: 'User already exists with this email' };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await db.query(
        `INSERT INTO users (email, password_hash, name, role, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) 
         RETURNING id, email, name, role, created_at`,
        [email, hashedPassword, name, 'user']
      );

      const user = result.rows[0];
      return { user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: 'Failed to create account' };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const result = await db.query(
        'SELECT id, email, name, role, password_hash, created_at FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return { user: null, error: 'Invalid email or password' };
      }

      const user = result.rows[0];
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
      const result = await db.query(
        'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
        [userId]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
};

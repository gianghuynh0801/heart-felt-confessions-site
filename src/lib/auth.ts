
import { supabase } from '@/integrations/supabase/client';

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
      // Use Supabase Auth for user registration
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create user' };
      }

      // The profile will be created automatically via the trigger
      const user: User = {
        id: authData.user.id,
        email: authData.user.email || email,
        name: name,
        role: 'user',
        created_at: new Date(authData.user.created_at)
      };
      
      return { user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: 'Failed to create account' };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { user: null, error: 'Invalid email or password' };
      }

      if (!authData.user) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Get the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return { user: null, error: 'Failed to get user profile' };
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email || email,
        name: profileData?.name || email,
        role: profileData?.role || 'user',
        created_at: new Date(authData.user.created_at)
      };
      
      return { user, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { user: null, error: 'Failed to sign in' };
    }
  },

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !profileData) {
        return null;
      }

      return {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
        created_at: new Date(profileData.created_at)
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
};


import { supabase } from "@/integrations/supabase/client";

export const db = {
  query: async (text: string, params?: any[]) => {
    // This is a simplified adapter to make the existing code work with Supabase
    // In a real application, you'd want to refactor to use Supabase's methods directly
    console.log('Supabase query adapter:', text, params);
    
    // Handle INSERT for users (though this should use Supabase Auth)
    if (text.includes('INSERT INTO users')) {
      throw new Error('User creation should use Supabase Auth');
    }
    
    // Handle SELECT for users by email
    if (text.includes('SELECT') && text.includes('users') && text.includes('email')) {
      const [email] = params || [];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return { rows: data ? [data] : [], rowCount: data ? 1 : 0 };
    }
    
    // Handle SELECT for users by id
    if (text.includes('SELECT') && text.includes('users') && text.includes('id')) {
      const [id] = params || [];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return { rows: data ? [data] : [], rowCount: data ? 1 : 0 };
    }
    
    // Handle INSERT for heart confessions
    if (text.includes('INSERT INTO heart_confessions')) {
      const [userId, message, imageData] = params || [];
      const { data, error } = await supabase
        .from('heart_confessions')
        .insert({
          user_id: userId,
          message: message,
          image_data: imageData
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return { rows: [data], rowCount: 1 };
    }
    
    // Handle SELECT for heart confessions by user
    if (text.includes('SELECT') && text.includes('heart_confessions') && text.includes('user_id')) {
      const [userId] = params || [];
      const { data, error } = await supabase
        .from('heart_confessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { rows: data || [], rowCount: data?.length || 0 };
    }
    
    // Handle DELETE for heart confessions
    if (text.includes('DELETE FROM heart_confessions')) {
      const [id, userId] = params || [];
      const { error } = await supabase
        .from('heart_confessions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return { rows: [], rowCount: 1 };
    }
    
    return { rows: [], rowCount: 0 };
  },
  connect: async () => {
    console.log('Supabase: Connection ready');
    return {
      query: db.query,
      release: () => console.log('Supabase: Connection released')
    };
  },
  end: async () => {
    console.log('Supabase: Connection ended');
  }
};

export default db;

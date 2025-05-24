
import { api } from './api';

export interface HeartConfession {
  id: string;
  user_id: string;
  message: string;
  image_data: string;
  created_at: Date;
  updated_at: Date;
}

export const heartsService = {
  async createConfession(userId: string, message: string, imageData: string): Promise<HeartConfession | null> {
    try {
      const confessionData = {
        user_id: userId,
        message,
        image_data: imageData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: confessions, error } = await api.post<HeartConfession[]>('/heart_confessions', confessionData);

      if (error || !confessions || confessions.length === 0) {
        console.error('Create confession error:', error);
        return null;
      }

      return confessions[0];
    } catch (error) {
      console.error('Create confession error:', error);
      return null;
    }
  },

  async getUserConfessions(userId: string): Promise<HeartConfession[]> {
    try {
      const { data: confessions, error } = await api.get<HeartConfession[]>(
        `/heart_confessions?user_id=eq.${userId}&order=created_at.desc`
      );

      if (error) {
        console.error('Get user confessions error:', error);
        return [];
      }

      return confessions || [];
    } catch (error) {
      console.error('Get user confessions error:', error);
      return [];
    }
  },

  async deleteConfession(id: string, userId: string): Promise<boolean> {
    try {
      const { error } = await api.delete(`/heart_confessions?id=eq.${id}&user_id=eq.${userId}`);

      if (error) {
        console.error('Delete confession error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete confession error:', error);
      return false;
    }
  }
};

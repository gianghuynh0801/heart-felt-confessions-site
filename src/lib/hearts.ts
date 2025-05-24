
import db from './database';

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
      const result = await db.query(
        `INSERT INTO heart_confessions (user_id, message, image_data, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) 
         RETURNING id, user_id, message, image_data, created_at, updated_at`,
        [userId, message, imageData]
      );

      const confessionData = result.rows[0];
      return {
        ...confessionData,
        created_at: new Date(confessionData.created_at),
        updated_at: new Date(confessionData.updated_at)
      };
    } catch (error) {
      console.error('Create confession error:', error);
      return null;
    }
  },

  async getUserConfessions(userId: string): Promise<HeartConfession[]> {
    try {
      const result = await db.query(
        'SELECT id, user_id, message, image_data, created_at, updated_at FROM heart_confessions WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      return result.rows.map((row: any) => ({
        ...row,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Get user confessions error:', error);
      return [];
    }
  },

  async deleteConfession(id: string, userId: string): Promise<boolean> {
    try {
      const result = await db.query(
        'DELETE FROM heart_confessions WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      return result.rowCount > 0;
    } catch (error) {
      console.error('Delete confession error:', error);
      return false;
    }
  }
};

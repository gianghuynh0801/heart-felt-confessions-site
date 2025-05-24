
// Mock database implementation for browser environment
// In a real application, this would be replaced with API calls to a backend server

export interface MockQueryResult {
  rows: any[];
  rowCount: number;
}

const mockData = {
  users: [] as any[],
  heart_confessions: [] as any[]
};

export const db = {
  query: async (text: string, params?: any[]): Promise<MockQueryResult> => {
    console.log('Mock DB Query:', text, params);
    
    // Mock INSERT for users
    if (text.includes('INSERT INTO users')) {
      const [email, passwordHash, name, role] = params || [];
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password_hash: passwordHash,
        name,
        role,
        created_at: new Date()
      };
      mockData.users.push(user);
      return { rows: [user], rowCount: 1 };
    }
    
    // Mock SELECT for users by email
    if (text.includes('SELECT') && text.includes('users') && text.includes('email')) {
      const [email] = params || [];
      const user = mockData.users.find(u => u.email === email);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }
    
    // Mock SELECT for users by id
    if (text.includes('SELECT') && text.includes('users') && text.includes('id')) {
      const [id] = params || [];
      const user = mockData.users.find(u => u.id === id);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }
    
    // Mock INSERT for heart confessions
    if (text.includes('INSERT INTO heart_confessions')) {
      const [userId, message, imageData] = params || [];
      const confession = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: userId,
        message,
        image_data: imageData,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockData.heart_confessions.push(confession);
      return { rows: [confession], rowCount: 1 };
    }
    
    // Mock SELECT for heart confessions by user
    if (text.includes('SELECT') && text.includes('heart_confessions') && text.includes('user_id')) {
      const [userId] = params || [];
      const confessions = mockData.heart_confessions
        .filter(c => c.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return { rows: confessions, rowCount: confessions.length };
    }
    
    // Mock DELETE for heart confessions
    if (text.includes('DELETE FROM heart_confessions')) {
      const [id, userId] = params || [];
      const index = mockData.heart_confessions.findIndex(c => c.id === id && c.user_id === userId);
      if (index !== -1) {
        mockData.heart_confessions.splice(index, 1);
        return { rows: [], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }
    
    return { rows: [], rowCount: 0 };
  },
  connect: async () => {
    console.log('Mock DB: Connection established');
    return {
      query: db.query,
      release: () => console.log('Mock DB: Connection released')
    };
  },
  end: async () => {
    console.log('Mock DB: Pool ended');
  }
};

export default db;

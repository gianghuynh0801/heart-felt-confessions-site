
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://toanclm_heartdraw_owner:4TFw0vRupo?b@ql8@125.253.113.100/toanclm_heartdraw_love?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  connect: () => pool.connect(),
  end: () => pool.end()
};

export default db;

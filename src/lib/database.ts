
import { Pool } from 'pg';

// Create PostgreSQL connection pool using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: false // Disable SSL for local connection
});

export const db = {
  query: async (text: string, params?: any[]) => {
    console.log('PostgreSQL query:', text, params);
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  },
  connect: async () => {
    console.log('PostgreSQL: Connection ready');
    const client = await pool.connect();
    return {
      query: (text: string, params?: any[]) => client.query(text, params),
      release: () => {
        console.log('PostgreSQL: Connection released');
        client.release();
      }
    };
  },
  end: async () => {
    console.log('PostgreSQL: Connection pool ended');
    await pool.end();
  }
};

export default db;

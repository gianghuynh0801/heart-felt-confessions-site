
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import bodyParser from "body-parser";
// Chưa định nghĩa schema, mẫu DB, nên chỉ tạo API base.

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());

// Kết nối PostgreSQL qua Drizzle
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});
const db = drizzle(pool);

// API mẫu: Đăng nhập (nên hash lại cho phù hợp)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // TODO: Replace logic with email/password hash checking với DB qua Drizzle ORM
  // Đây chỉ là placeholder. Khi có schema sẽ viết truy vấn thật.
  if (email === "test@example.com" && password === "pass") {
    return res.json({ user: { email, name: "Test User" }, token: "fake_token" });
  }
  return res.status(401).json({ error: "Invalid email or password" });
});

// API mẫu: Lấy drawings (sau này truy vấn DB)
app.get("/api/drawings", async (req, res) => {
  // TODO: lấy danh sách drawings từ DB với Drizzle
  return res.json([
    { id: 1, data: "heart-data-1", message: "Happy 1" },
    { id: 2, data: "heart-data-2", message: "Happy 2" },
  ]);
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

export default app;

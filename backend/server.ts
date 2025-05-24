
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

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

// API: Đăng ký user mới (signup)
app.post("/api/profiles", async (req, res) => {
  const { email, name, password_hash, role, created_at } = req.body;

  if (!email || !password_hash) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Kiểm tra user đã tồn tại chưa
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Tạo user mới, đã hash trước ở frontend
    const id = uuidv4();
    const now = created_at ? new Date(created_at) : new Date();
    const insert = await pool.query(
      `INSERT INTO users (id, email, name, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, role, created_at`,
      [id, email, name || null, password_hash, role || "user", now]
    );
    res.status(201).json(insert.rows);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error when creating user" });
  }
});

// API: Lấy thông tin user theo email hoặc id
app.get("/api/profiles", async (req, res) => {
  let { email, id } = req.query;

  if (!email && !id) {
    return res.status(400).json({ error: "Query 'email' hoặc 'id' parameter is required" });
  }

  // Loại bỏ "eq." prefix nếu có trong query
  if (typeof email === "string" && email.startsWith("eq.")) {
    email = email.substring(3);
  }
  if (typeof id === "string" && id.startsWith("eq.")) {
    id = id.substring(3);
  }

  try {
    let result;
    if (email) {
      result = await pool.query(
        "SELECT id, email, name, role, created_at, password_hash FROM users WHERE email = $1",
        [email]
      );
    } else {
      result = await pool.query(
        "SELECT id, email, name, role, created_at, password_hash FROM users WHERE id = $1",
        [id]
      );
    }
    // Nếu không có hàng nào, trả array rỗng (tránh res.status(404))
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Server error while fetching user" });
  }
});

// API: Đăng nhập (so khớp trực tiếp - chỉ dùng cho quick check!)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Lấy user theo email
    const result = await pool.query(
      "SELECT id, email, name, role, created_at, password_hash FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Ẩn password_hash khi trả về
    const { password_hash, ...userSafe } = user;
    res.json({ user: userSafe, token: "fake_token" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// API mẫu: Lấy drawings (placeholder)
app.get("/api/drawings", async (req, res) => {
  // TODO: lấy danh sách drawings từ DB với Drizzle thực tế
  return res.json([
    { id: 1, data: "heart-data-1", message: "Happy 1" },
    { id: 2, data: "heart-data-2", message: "Happy 2" },
  ]);
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

export default app;


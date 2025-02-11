import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    // const [rows] = await pool.query("SELECT NOW()");
    // res.json({ time: rows });
    res.send(`
      <form action="/users/create" method="post">
        <input type="text" name="name" placeholder="名前" />
        <input type="email" name="email" placeholder="メールアドレス" />
        <input type="password" name="password" placeholder="パスワード" />
        <button type="submit">追加</button>
      </form>
    `);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/users/create", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // ここでフォームデータを使用できます
    res.json({ name, email, password });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

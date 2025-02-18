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
    await pool.query("START TRANSACTION");
    const { name, email, password } = req.body;
    const [rows] = await pool.query("CALL createUser(?, ?, ?)", [
      name,
      email,
      password,
    ]);
    console.log(rows);

    await pool.query("COMMIT");
    res.json({ name, email, password });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    res.send(`
      <form action="/tasks/create" method="post">
        <input type="text" name="title" placeholder="タイトル" />
        <input type="text" name="description" placeholder="説明" />
        <button type="submit">追加</button>
      </form>
    `);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/tasks/create", async (req, res) => {
  try {
    await pool.query("START TRANSACTION");

    const [users]: [{ id: number }[]] = (await pool.query(
      "SELECT * FROM users LIMIT 1"
    )) as unknown as [{ id: number }[]];

    const { title, description } = req.body;
    const [rows] = await pool.query("CALL createTask(?, ?, ?)", [
      users[0].id,
      title,
      description,
    ]);
    console.log(rows);

    await pool.query("COMMIT");
    res.json({ title, description });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/tasks/:id/update", async (req, res) => {
  try {
    await pool.query("START TRANSACTION");

    const [users]: [{ id: number }[]] = (await pool.query(
      "SELECT * FROM users LIMIT 1"
    )) as unknown as [{ id: number }[]];

    const { id } = req.params;
    const { title, description } = req.body;
    const [rows] = await pool.query("CALL updateTask(?, ?, ?)", [
      id,
      users[0].id,
      title,
      description,
    ]);
    console.log(rows);

    await pool.query("COMMIT");
    res.json({ title, description });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: (error as Error).message });
  }
});

app.delete("/tasks/:id/delete", async (req, res) => {
  try {
    await pool.query("START TRANSACTION");

    const { id } = req.params;
    const [rows] = await pool.query("CALL deleteTask(?)", [id]);
    console.log(rows);

    await pool.query("COMMIT");
    res.json({ id });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

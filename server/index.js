import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const SECRET = "mysecretkey";

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password, username) VALUES ($1,$2,$3)",
      [email.trim(), hash, username.trim()]
    );

    res.json({ message: "Signup success" });

  } catch (err) {
    res.json({ message: "User already exists" });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1 OR username=$1",
    [email.trim()]
  );

  if (result.rows.length === 0) {
    return res.json({ message: "User not found" });
  }

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ userId: user.id }, SECRET);

  res.json({
    token,
    username: user.username,
    userId: user.id,
  });
});

// ================= CHAT HISTORY =================
app.get("/messages/:userId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM messages WHERE user_id=$1 ORDER BY id ASC",
    [req.params.userId]
  );
  res.json(result.rows);
});

// ================= AI CHAT =================
app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  try {
    await pool.query(
      "INSERT INTO messages (user_id, text, sender) VALUES ($1,$2,$3)",
      [userId, message, "user"]
    );

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content || "Hi 🤍";

    await pool.query(
      "INSERT INTO messages (user_id, text, sender) VALUES ($1,$2,$3)",
      [userId, reply, "bot"]
    );

    res.json({ reply });

  } catch {
    res.json({ reply: "Server error 😢" });
  }
});

// ================= STRANGER CHAT =================
let waitingUser = null;

io.on("connection", (socket) => {

  if (waitingUser) {
    socket.partner = waitingUser;
    waitingUser.partner = socket;

    socket.emit("matched");
    waitingUser.emit("matched");

    waitingUser = null;
  } else {
    waitingUser = socket;
  }

  socket.on("send-message", (msg) => {
    if (socket.partner) {
      socket.partner.emit("receive-message", msg);
    }
  });

  socket.on("disconnect", () => {
    if (socket.partner) {
      socket.partner.emit("stranger-left");
      socket.partner.partner = null;
    }
    if (waitingUser === socket) waitingUser = null;
  });
});

server.listen(5000, () => console.log("🚀 Server running"));
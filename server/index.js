import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import axios from "axios";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// STATIC FILES
app.use("/uploads", express.static("uploads"));

// STORAGE
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const SECRET = "mysecretkey";

// ROOT
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// SIGNUP
app.post("/signup", upload.single("avatar"), async (req, res) => {
  const { email, password, username } = req.body;
  const avatar = req.file ? req.file.filename : null;

  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (email, password, username, avatar) VALUES ($1,$2,$3,$4)",
      [email, hash, username, avatar]
    );

    res.json({ message: "Signup success" });
  } catch {
    res.json({ message: "User exists" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0)
    return res.json({ message: "User not found" });

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ userId: user.id }, SECRET);

  res.json({
    token,
    username: user.username,
    avatar: user.avatar,
    userId: user.id,
  });
});

// CHAT
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

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

    res.json({
      reply:
        response.data.choices?.[0]?.message?.content || "Hi 🤍",
    });

  } catch {
    res.json({ reply: "Server error 😢" });
  }
});

app.listen(5000, () => console.log("🚀 Server running"));
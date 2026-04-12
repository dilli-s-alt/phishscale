import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const demoEmail = process.env.DEMO_EMAIL || "test@test.com";
const demoPassword = process.env.DEMO_PASSWORD || "123456";
const jwtSecret = process.env.JWT_SECRET || "secret";

const getDemoUser = async () => {
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  return {
    id: "demo-user",
    email: demoEmail,
    password: passwordHash,
    source: "demo"
  };
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await pool.query(
      "INSERT INTO users(email,password) VALUES($1,$2) RETURNING id,email",
      [email, hash]
    );

    res.json(user.rows[0]);
  } catch (error) {
    console.error("Register failed:", error.message);
    res.status(500).json({
      error: "Registration failed. Check database configuration before creating users."
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let user = null;

    try {
      const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
      user = result.rows[0] || null;
    } catch (dbError) {
      console.warn("Database login lookup failed, falling back to demo user:", dbError.message);
    }

    if (!user && email === demoEmail) {
      user = await getDemoUser();
    }

    if (!user) {
      return res.status(400).json({
        error: `User not found. Use ${demoEmail} / ${demoPassword} for demo access or seed the database.`
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: "1d"
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
};

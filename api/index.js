import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";
import path from "path";
import { fileURLToPath } from "url";

import authrouter from "./routes/auth.js";
import usersrouter from "./routes/users.js";
import fieldsrouter from "./routes/fields.js";
import bookingrouter from "./routes/booking.js";
import statsRoutes from "./routes/stats.js";
import userRoutes from "./routes/user.js";
import chatbotRoutes from './routes/chatbotRoutes.js';
import adminRoutes from "./routes/admin.js";
import contactRoutes from './routes/contact.js';

const app = express();
dotenv.config();
const PORT = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

// ✅ Middleware pour rendre 'uploads' public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/chatbot", chatbotRoutes);
app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authrouter);
app.use("/users", usersrouter);
app.use("/fields", fieldsrouter);
app.use("/booking", bookingrouter);
app.use("/api/stats", statsRoutes);
app.use("/admin", adminRoutes);
app.use('/api/contact', contactRoutes);


app.listen(PORT, () => {
  connect();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

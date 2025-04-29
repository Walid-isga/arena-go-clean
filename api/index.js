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
const PORT = process.env.PORT || 8000; // ✅ Railway donne son propre port en prod

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

// ✅ Middleware pour rendre 'uploads' public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Cookie Session sécurisée
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction, // doit être true si Vercel (HTTPS)
  })
);

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ CORS pour autoriser localhost + Vercel
const allowedOrigins = [
  "https://arenago.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Body Parser (important après CORS)
app.use(express.json());

// ✅ Routes
app.use("/auth", authrouter);
app.use("/users", userRoutes); // ✅ pas 2x "users" comme avant
app.use("/fields", fieldsrouter);
app.use("/booking", bookingrouter);
app.use("/api/stats", statsRoutes);
app.use("/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Lancement du serveur
app.listen(PORT, () => {
  connect();
  console.log(`🚀 Server running on port ${PORT}`);
});

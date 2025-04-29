import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connexion MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

// ✅ Middleware pour servir 'uploads' en public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Cookie Session Configuration
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1); // Important pour Railway / Vercel
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 1 jour
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction, // true en production (HTTPS)
  })
);

// ✅ Passport (si tu l'utilises encore)
app.use(passport.initialize());
app.use(passport.session());

// ✅ CORS avec credentials
const allowedOrigins = [
  "https://arenago.vercel.app",
  "http://localhost:3000",
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

// ✅ Body Parser
app.use(express.json());

// ✅ Routes
app.use("/auth", authrouter);
app.use("/users", userRoutes);
app.use("/fields", fieldsrouter);
app.use("/booking", bookingrouter);
app.use("/api/stats", statsRoutes);
app.use("/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Serveur
app.listen(PORT, () => {
  connect();
  console.log(`🚀 Server running on port ${PORT}`);
});

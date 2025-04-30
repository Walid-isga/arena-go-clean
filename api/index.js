import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

import authrouter from "./routes/auth.js";
import usersrouter from "./routes/user.js";
import fieldsrouter from "./routes/fields.js";
import bookingrouter from "./routes/booking.js";
import statsRoutes from "./routes/stats.js";
import adminRoutes from "./routes/admin.js";
import chatbotRoutes from './routes/chatbotRoutes.js';
import contactRoutes from './routes/contact.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Nécessaire pour Railway en production
app.set("trust proxy", 1);

// ✅ Middleware CORS — LIGNE LA PLUS IMPORTANTE 🔥
app.use(cors({
  origin: ["https://arenago.vercel.app", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // ⬅️ TRÈS IMPORTANT
}));

// ✅ Body parser
app.use(express.json());

// ✅ Sessions (optionnel si pas utilisé avec JWT)
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  })
);

// ✅ Initialiser Passport si utilisé (sinon retire)
app.use(passport.initialize());
app.use(passport.session());

// ✅ Serve fichiers statiques (ex: images terrains)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes API
app.use("/auth", authrouter);
app.use("/users", usersrouter);
app.use("/fields", fieldsrouter);
app.use("/booking", bookingrouter);
app.use("/api/stats", statsRoutes);
app.use("/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Connexion MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

// ✅ Lancer le serveur
app.listen(PORT, () => {
  connect();
  console.log(`🚀 Server running on port ${PORT}`);
});

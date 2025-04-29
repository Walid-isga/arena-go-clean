// routes/user.js
import express from "express";
import { upload } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  updateUserController,
  getCurrentUser,
} from "../controllers/user.js";

const router = express.Router();

// ✅ Route protégée : récupérer l'utilisateur connecté
router.get("/me", authMiddleware, getCurrentUser);

// ✅ Mettre à jour le profil avec image (protégé ou non selon ton choix)
router.patch("/:id", upload.single("picture"), updateUserController);

export default router;

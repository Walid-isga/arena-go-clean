import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/users.js";

import {
  updateUserController,
  getCurrentUser,
} from "../controllers/user.js";

import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * ✅ Routes protégées
 */

// Obtenir les infos de l'utilisateur connecté (nécessite un token)
router.get("/me", authMiddleware, getCurrentUser);

// Mettre à jour un utilisateur avec image uploadée
router.patch("/:id", upload.single("picture"), updateUserController);

/**
 * ✅ Routes publiques ou générales
 */

// Obtenir tous les utilisateurs
router.get("/", getAllUsers);

// Obtenir un utilisateur par ID
router.get("/:id", getUser);

// Mettre à jour un utilisateur (sans image)
router.patch("/:id", updateUser);

export default router;

import express from "express";
import { upload } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.js";
import { updateUserController, getCurrentUser } from "../controllers/user.js";
import { getUserById } from "../controllers/user.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);
router.get("/:id", getUserById); // ✅ ajouter cette ligne
router.patch("/:id", upload.single("picture"), updateUserController);

export default router;

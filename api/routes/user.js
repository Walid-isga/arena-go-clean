import express from "express";
import { upload } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  updateUserController,
  getCurrentUser,
} from "../controllers/user.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

router.patch("/:id", upload.single("picture"), updateUserController);

export default router;

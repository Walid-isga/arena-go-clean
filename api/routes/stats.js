import express from "express";
import { getStats } from "../controllers/stats.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

// 👇 Ne pas oublier d'ajouter /api/stats dans index.js
router.get("/", verifyAdmin, getStats);

export default router;

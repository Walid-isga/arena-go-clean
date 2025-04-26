import express from "express";
import { updateUserController } from "../controllers/user.js";
import { upload } from "../middleware/upload.js"; // Importation du middleware pour l'upload d'image

const router = express.Router();

// Route pour mettre à jour les infos utilisateur (y compris image de profil)
router.patch("/:id", upload.single("picture"), updateUserController);

export default router;

import express from "express";
import Field from "../models/field.js";
import { createField, updateField, deleteField, getAllFields, getField, getFieldsBySport } from "../controllers/field.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configuration de multer pour upload d'image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes principales
router.post("/", upload.single("image"), createField); // Créer un terrain avec image
router.put("/:id", upload.single("photo"), updateField);
router.delete("/:id", deleteField); // Supprimer un terrain
router.get("/:id", getField); // Récupérer un seul terrain
router.get("/", getAllFields); // Récupérer tous les terrains
router.get("/", getFieldsBySport);

export default router;
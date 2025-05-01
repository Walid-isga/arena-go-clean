import User from "../models/user.js";
import bcrypt from "bcryptjs";

// ✅ Mise à jour du profil utilisateur
export const updateUserController = async (req, res) => {
  const userId = req.params.id;
  const { username, email, city, phone, password } = req.body;
  const file = req.file;

  try {
    const updateFields = {
      ...(username && { username }),
      ...(email && { email }),
      ...(city && { city }),
      ...(phone && { phone }),
    };

    if (password && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    if (file) {
      updateFields.picture = `/uploads/${file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    res.status(200).json({
      message: "✅ Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Erreur de mise à jour :", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour." });
  }
};

// ✅ Récupération de l'utilisateur connecté (par token)
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Récupération d’un utilisateur par ID (⚠️ utile pour téléchargement PDF)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Erreur getUserById :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

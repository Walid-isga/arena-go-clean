import User from "../models/user.js";

// 🔹 Obtenir tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur getAllUsers:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Obtenir un utilisateur par ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur getUser:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Mettre à jour un utilisateur (sans image uploadée)
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Utilisateur mis à jour", user: updated });
  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

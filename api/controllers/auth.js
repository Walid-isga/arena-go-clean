import User from "../models/user.js";
import { sendOTP } from "../utils/sendOTP.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

// ✅ INSCRIPTION avec envoi d'OTP
export const registerWithEmailController = async (req, res) => {
  const { email, password, username, city, phone } = req.body;

  console.log("Données reçues :", req.body); // 🔍 Vérifie le contenu exact

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ Email déjà utilisé :", email);
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    if (!password) {
      console.log("❌ Mot de passe vide !");
      return res.status(400).json({ message: "Mot de passe requis." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Mot de passe hashé :", hashedPassword);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      otp,
      city,
      phone,
      isVerified: false,
    });

    await newUser.save();
    console.log("✅ Utilisateur enregistré :", email);
    await sendOTP(email, otp);

    res.status(201).json({ message: "Compte créé. Un code OTP a été envoyé par email." });
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


// ✅ VÉRIFICATION DE L'OTP
export const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Code OTP invalide." });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();
    
    // ✅ Envoi email de bienvenue
    await sendWelcomeEmail({ to: user.email, username: user.username });
    

    res.status(200).json({ message: "✅ Compte vérifié avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la vérification OTP." });
  }
};

// ✅ RÉENVOI DE L'OTP
export const resendOtpController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    await user.save();

    await sendOTP(email, otp);
    res.status(200).json({ message: "📧 Nouveau code OTP envoyé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du renvoi du code OTP." });
  }
};

// ✅ CONNEXION PAR EMAIL + MOT DE PASSE

export const loginWithEmailController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    if (!user.isVerified)
      return res.status(403).json({ message: "Veuillez vérifier votre compte par OTP." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    // Créer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    // Réponse côté client
    res.status(200).json({
      message: "Connexion réussie",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        city: user.city,
        phone: user.phone,
        picture: user.picture,
      },
      token, // <== c'est ça qu'on va stocker pour accéder à /users/me
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};


export const logoutController = async (req, res) => {
  try {
    // 🔐 Supprimer la session si tu utilises express-session
    req.session = null;

    // 🧼 Supprimer les cookies de session (si tu utilises cookie-session)
    res.clearCookie("session", { path: "/", httpOnly: true, sameSite: "lax" });
    res.clearCookie("session.sig", { path: "/", httpOnly: true, sameSite: "lax" });

    // ✅ Réponse au client
    return res.status(200).json({
      success: true,
      message: "Déconnecté avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur dans logoutController :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion",
    });
  }
};


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

    res.status(200).json({ message: "✅ Profil mis à jour", user: updatedUser });
  } catch (err) {
    console.error("❌ Erreur MAJ :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

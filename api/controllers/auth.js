import User from "../models/user.js";
import { sendOTP } from "../utils/sendOTP.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

// ✅ INSCRIPTION
export const registerWithEmailController = async (req, res) => {
  const { email, password, username, city, phone } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

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
    await sendOTP(email, otp);

    res.status(201).json({ message: "Compte créé. Un code OTP a été envoyé par email." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ VÉRIFIER OTP
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
    await sendWelcomeEmail({ to: user.email, username: user.username });

    res.status(200).json({ message: "✅ Compte vérifié avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la vérification OTP." });
  }
};

// ✅ RÉENVOYER OTP
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
    res.status(500).json({ message: "Erreur lors du renvoi du code OTP." });
  }
};

// ✅ CONNEXION
export const loginWithEmailController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Veuillez vérifier votre compte par OTP." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    // ✅ Générer un Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    // ✅ Stocker dans la session
    req.session.user = {
      id: user._id,
      email: user.email,
    };

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
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};

// ✅ DÉCONNEXION
export const logoutController = async (req, res) => {
  try {
    req.session = null;
    res.clearCookie("session", { path: "/", httpOnly: true, sameSite: "lax" });
    res.clearCookie("session.sig", { path: "/", httpOnly: true, sameSite: "lax" });

    return res.status(200).json({
      success: true,
      message: "Déconnecté avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion",
    });
  }
};

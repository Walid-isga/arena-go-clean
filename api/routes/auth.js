import express from "express";
import {
  logoutController,
  registerWithEmailController,
  loginWithEmailController,
  verifyOtpController,
  resendOtpController
} from "../controllers/auth.js";

const router = express.Router();
router.get("/logout", logoutController);
router.post("/login", loginWithEmailController);

// ✅ Ajout des routes email/OTP
router.post("/register", registerWithEmailController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);

export default router;

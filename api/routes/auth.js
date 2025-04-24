import express from "express";
import {
  loginController,
  loginFailedController,
  googlecontroller,
  googleRedirectCallbackController,
  logoutController
} from "../controllers/auth.js";

const router = express.Router();

router.get("/login/success", loginController);
router.get("/login/failed", loginFailedController);
router.get("/google", googlecontroller);
router.get("/google/callback", googleRedirectCallbackController);
router.get("/logout", logoutController);

export default router;

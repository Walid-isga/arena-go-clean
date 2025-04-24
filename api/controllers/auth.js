import passport from "passport";
import User from "../models/user.js";

export const loginController = async (req, res) => {
  if (req.user) {
    try {
      const user = await User.findOrCreate(req.user);
      res.status(200).json({
        success: true,
        message: "User has successfully authenticated",
        user,
        googleinfo: req.user,
        cookies: req.cookies,
        error: false,
      });
    } catch (error) {
      res.status(500).json({ error: true, message: "Database error" });
    }
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};

export const loginFailedController = (req, res) => {
  res.status(401).json({
    error: true,
    message: "User failed to authenticate.",
  });
};

export const googlecontroller = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
};

export const googleRedirectCallbackController = async (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect("/auth/login/failed");

    req.login(user, async (loginErr) => {
      if (loginErr) return next(loginErr);
      await User.findOrCreate(user);
      return res.redirect("http://localhost:3000/home");
    });
  })(req, res, next);
};

export const logoutController = (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la déconnexion",
        error: err,
      });
    }

    // 👇 NETTOYAGE des cookies
    res.clearCookie("session", { path: "/", httpOnly: true, sameSite: "lax" });
    res.clearCookie("session.sig", { path: "/", httpOnly: true, sameSite: "lax" });

    return res.status(200).json({
      success: true,
      message: "Déconnecté avec succès",
    });
  });
};

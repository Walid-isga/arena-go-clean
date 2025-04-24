export const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next(); // ✅ L'utilisateur est admin → continuer
    } else {
      return res.status(403).json({ success: false, message: "Accès refusé : admin uniquement" });
    }
  };
  
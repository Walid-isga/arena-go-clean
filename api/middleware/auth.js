import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // on ajoute l'ID décodé à la requête
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide." });
  }
};

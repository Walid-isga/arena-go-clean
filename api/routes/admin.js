import express from "express";
import Field from "../models/field.js";
import Booking from "../models/booking.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const fields = await Field.countDocuments();
    const bookings = await Booking.countDocuments();
    const users = await User.countDocuments();

    res.json({ fields, bookings, users });
  } catch (err) {
    console.error("Erreur stats admin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
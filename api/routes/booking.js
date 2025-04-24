import express from 'express';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
  getBookingsByField,
  getPendingBookings,
  confirmBooking,
  getUpcomingBookings,
  getUpcomingAndPastBookings,
  getPastBookings,
  rejectBooking
} from "../controllers/booking.js";

const router = express.Router();

// ✅ Routes d'action en premier pour éviter conflits avec "/:id"
router.patch("/confirm/:id", confirmBooking);
router.patch("/reject/:id", rejectBooking);

// 🧾 Routes classiques
router.get("/", getBookings);
router.post("/", createBooking);
router.get("/user/:id", getBookingsByUser);
router.get("/field/:id", getBookingsByField);
router.get("/status/pending", getPendingBookings);
router.get("/:id", getBooking);
router.patch("/:id", updateBooking);
router.delete("/:id", deleteBooking);

router.get("/upcoming/:userId", getUpcomingBookings);
router.get("/past/:userId", getPastBookings);
router.get("/user-matches/:id", getUpcomingAndPastBookings);
export default router;

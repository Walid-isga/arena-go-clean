
import Booking from "../models/booking.js";
import mongoose from "mongoose";
import { sendBookingConfirmation, sendBookingRefusal } from "../utils/sendEmail.js";
import User from "../models/user.js";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Field from "../models/field.js";

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  const { field, user, date, starttime, endtime, status, teamName, players } = req.body;
  console.log("➕ Tentative de réservation avec les données :");
console.log({ field, user, date, starttime, endtime, status, teamName, players });


  try {
    const overlappingBooking = await Booking.findOne({
      field,
      date: { $eq: date },
      status: "Confirmed",
      $or: [
        {
          $and: [
            { starttime: { $lt: endtime } },
            { endtime: { $gt: starttime } },
          ]
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: "Le terrain est déjà réservé pour ce créneau horaire.",
        field: overlappingBooking.field,
        date: overlappingBooking.date,
        start: overlappingBooking.starttime,
        end: overlappingBooking.endtime,
      });
    }

    const booking = new Booking({ field, user, date, starttime, endtime, status, teamName, players });
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Erreur lors de la création de réservation :", error);
    res.status(500).json({ message: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Confirmed' }, { new: true });
    const user = await User.findById(booking.user);
    const field = await Field.findById(booking.field);

    const formattedDate = format(new Date(booking.date), "dd MMMM yyyy", { locale: fr });
    const formattedStart = format(new Date(`2000-01-01T${booking.starttime}`), "HH:mm");
    const formattedEnd = format(new Date(`2000-01-01T${booking.endtime}`), "HH:mm");    

    await sendBookingConfirmation({
      to: user.email,
      teamName: booking.teamName,
      date: formattedDate,
      starttime: formattedStart,
      endtime: formattedEnd,
      field: field.name,
    });

    res.json({ message: "Réservation confirmée et email envoyé." });
  } catch (error) {
    console.error("Erreur de confirmation:", error);
    res.status(500).json({ message: error.message });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    const user = await User.findById(booking.user);
    const field = await Field.findById(booking.field);

    const formattedDate = format(new Date(booking.date), "dd MMMM yyyy", { locale: fr });
    const formattedStart = format(new Date(`2000-01-01T${booking.starttime}`), "HH:mm");
    const formattedEnd = format(new Date(`2000-01-01T${booking.endtime}`), "HH:mm");
    

    await sendBookingRefusal({
      to: user.email,
      teamName: booking.teamName,
      date: formattedDate,
      starttime: formattedStart,
      endtime: formattedEnd,
      field: field.name,
    });

    res.json({ message: "Réservation rejetée et email envoyé." });
  } catch (error) {
    console.error("Erreur de rejet:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Deleted Booking" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.id }).populate("field");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingsByField = async (req, res) => {
  try {
    const { start, end } = req.query;
    const { id } = req.params;

    const query = {
      field: id,
    };

    if (start && end) {
      query.date = { $gte: start, $lte: end };
    }

    // ✅ On récupère toutes les réservations (Confirmed + Pending)
    const bookings = await Booking.find(query);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Pending" });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingBookings = async (req, res) => {
  try {
    const now = new Date();
    const bookings = await Booking.find({
      user: req.params.userId,
      status: "Confirmed",
      date: { $gte: now.toISOString().split("T")[0] },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPastBookings = async (req, res) => {
  try {
    const now = new Date();
    const bookings = await Booking.find({
      user: req.params.userId,
      status: "Confirmed",
      date: { $lt: now.toISOString().split("T")[0] },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingAndPastBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    const now = new Date();

    const upcoming = await Booking.find({
      user: userId,
      status: "Confirmed",
      $expr: {
        $gte: [
          { $dateFromString: { dateString: { $concat: ["$date", "T", "$starttime"] } } },
          now
        ]
      }
    }).sort({ date: 1 });

    const past = await Booking.find({
      user: userId,
      status: "Confirmed",
      $expr: {
        $lt: [
          { $dateFromString: { dateString: { $concat: ["$date", "T", "$endtime"] } } },
          now
        ]
      }
    }).sort({ date: -1 });

    res.json({ upcoming, past });
  } catch (error) {
    console.error("❌ Erreur getUpcomingAndPastBookings :", error);
    res.status(500).json({ message: error.message });
  }
};

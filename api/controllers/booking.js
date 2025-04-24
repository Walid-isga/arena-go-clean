import Booking from "../models/booking.js";
import mongoose from "mongoose";
import { sendBookingConfirmation, sendBookingRefusal } from "../utils/sendEmail.js";
import User from "../models/user.js";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // ✅ Correct
import Field from "../models/field.js";
import { isBefore, isAfter } from 'date-fns';

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

  try {
    const overlappingBooking = await Booking.findOne({
      field: field,
      date: new Date(date),
      $or: [
        { starttime: { $lte: starttime }, endtime: { $gte: starttime } },
        { starttime: { $lte: endtime }, endtime: { $gte: endtime } },
        { starttime: { $gte: starttime }, endtime: { $lte: endtime } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Booking time conflicts with an existing booking." });
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
    const field = await Field.findById(booking.field); // récupère le nom du terrain

    // ➕ Formatage
    const formattedDate = format(new Date(booking.date), "dd MMMM yyyy", { locale: fr });
    const formattedStart = format(new Date(booking.starttime), "HH:mm");
    const formattedEnd = format(new Date(booking.endtime), "HH:mm");

    await sendBookingConfirmation({
      to: user.email,
      teamName: booking.teamName,
      date: formattedDate,
      starttime: formattedStart,
      endtime: formattedEnd,
      field: field.name, // on envoie le nom au lieu de l’ID
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

    // ➕ Formatage
    const formattedDate = format(new Date(booking.date), "dd MMMM yyyy", { locale: fr });
    const formattedStart = format(new Date(booking.starttime), "HH:mm");
    const formattedEnd = format(new Date(booking.endtime), "HH:mm");

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
    const bookings = await Booking.find({ user: req.params.id })
      .populate("field"); // pour avoir le nom + sport du terrain

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getBookingsByField = async (req, res) => {
    try {
      const bookings = await Booking.find({
        field: req.params.id,
        status: "Confirmed", // ✅ filtre uniquement les confirmées
      });
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
      date: { $gte: now }
    }).sort({ date: 1 });

    const past = await Booking.find({
      user: userId,
      status: "Confirmed",
      date: { $lt: now }
    }).sort({ date: -1 });

    res.json({ upcoming, past });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


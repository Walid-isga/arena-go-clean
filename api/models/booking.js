import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: String, // ✅ on utilise "String" au lieu de "Date" pour correspondre au format "YYYY-MM-DD"
    required: true,
  },
  starttime: {
    type: String, // format attendu : "HH:mm"
    required: true,
  },
  endtime: {
    type: String, // format attendu : "HH:mm"
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected"], // ✅ "Confirmed" utilisé dans ta logique
    default: "Pending",
    required: true,
  },
  players: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Booking", BookingSchema);

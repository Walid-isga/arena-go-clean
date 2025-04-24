import Booking from "../models/booking.js";

export const getStats = async (req, res) => {
  try {
    const byDate = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const byField = await Booking.aggregate([
      {
        $group: {
          _id: "$field",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ byDate, byField });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

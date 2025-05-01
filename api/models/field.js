import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  dimensions: {
    length: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    }
  },
  surfaceType: {
    type: String,
    enum: ['Gazon', 'Synthétique', 'Béton', 'Terre battue', 'Autre']
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  lights: {
    type: Boolean,
    default: false
  },
  amenities: {
    seating: {
      type: Boolean,
      default: false
    },
    changing_room: {
      type: Boolean,
      default: false
    }
  },
  bookingInfo: {
    contactEmail: String,
    Phonenumber: String,
    alternativePhonenumber: String
  },
  photos: {
    type: [String]
  },
  description: {
    type: String,
    required: true
  },
  publicDescription: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  }
});

export default mongoose.model('Field', FieldSchema);

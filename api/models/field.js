import mongoose from "mongoose";


// this is a schema for the sport fields (This is just a template to show to the professor for now we need to discuss it more)
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
        },
        // we can add more here for example foe the basketball courts or the tennis one ...
    },
    surfaceType: {
        type: String,
        enum: ['Gazon', 'Synthétique', 'Béton', 'Terre battue', 'Autre'] // we can make it as a file for enums
    },

    location: {
        city: String,
        state: String,
        country: String
    },
    // this  will help us to show the right schedule for some fields since thwy cannot booked at night
    lights: {
        type: Boolean,
        default: false
    },
    amenities: {
        // here we can talk about if there are places where people can seat and watch/ changing rooms ...
        seating: {
            type: Boolean,
            default: false
        },
        changing_room: {
            type: Boolean,
            default: false
        },
    },
    bookingInfo: {
        contactEmail: String,
        Phonenumber: String,
        alternativePhonenumber: String,
    },
    // these will help us give the customer an idea about the field before booking it
    photos: {
        type: [String]
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    }
});

export default mongoose.model('Field', FieldSchema);
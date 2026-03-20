import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true }
});

const flightSchema = new mongoose.Schema({
    flightName: String,
    flightId: String,
    origin: String,
    destination: String,
    departureTime: String,
    arrivalTime: String,
    basePrice: Number,
    totalSeats: Number
});

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    status: { type: String, default: "confirmed" }
});

export const User = mongoose.model('users', userSchema);
export const Flight = mongoose.model('Flight', flightSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
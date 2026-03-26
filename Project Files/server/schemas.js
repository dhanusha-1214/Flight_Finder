import mongoose from "mongoose";

// ── USER ──────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  usertype:  { type: String, enum: ["traveler", "operator", "admin"], default: "traveler" },
  approval:  { type: String, enum: ["approved", "pending"], default: "approved" },
  phone:     { type: String },
  country:   { type: String },
}, { timestamps: true });

// ── FLIGHT ─────────────────────────────────────────────
const flightSchema = new mongoose.Schema({
  flightName:      { type: String, required: true },
  flightId:        { type: String, required: true },
  origin:          { type: String, required: true },
  destination:     { type: String, required: true },
  departureTime:   { type: String, required: true },
  arrivalTime:     { type: String, required: true },
  basePrice:       { type: Number, required: true },
  totalSeats:      { type: Number, required: true },
  availableSeats:  { type: Number },
  operatorId:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// ── BOOKING ────────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight:        { type: mongoose.Schema.Types.ObjectId, ref: "Flight" },
  flightName:    { type: String, required: true },
  flightId:      { type: String },
  departure:     { type: String },
  destination:   { type: String },
  email:         { type: String },
  mobile:        { type: String },
  seats:         { type: String },       // e.g. "B-1, B-2"
  passengers:    [{
    name:     { type: String },
    age:      { type: Number },
    passport: { type: String },
  }],
  totalPrice:    { type: Number },
  bookingDate:   { type: Date, default: Date.now },
  journeyDate:   { type: Date },
  journeyTime:   { type: String },
  seatClass:     { type: String, default: "economy" },
  bookingStatus: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
}, { timestamps: true });

export const User    = mongoose.model("User",    userSchema);
export const Flight  = mongoose.model("Flight",  flightSchema);
export const Booking = mongoose.model("Booking", bookingSchema);

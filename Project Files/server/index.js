import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Flight, Booking } from "./schemas.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6001;
const JWT_SECRET = process.env.JWT_SECRET || "flightfinder_secret_key_2024";
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/flightfinder";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.usertype !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

// ============ AUTH ROUTES ============

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const approval = usertype === "operator" ? "pending" : "approved";
    const user = new User({ username, email, password: hashedPassword, usertype, approval });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.approval === "pending") return res.status(403).json({ message: "Account pending approval" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username, usertype: user.usertype },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email, usertype: user.usertype } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ============ FLIGHT ROUTES ============

// Get all flights (public)
app.get("/api/flights", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Search flights
app.get("/api/flights/search", async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    const query = {};
    if (origin) query.origin = { $regex: origin, $options: "i" };
    if (destination) query.destination = { $regex: destination, $options: "i" };
    const flights = await Flight.find(query);
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single flight
app.get("/api/flights/:id", async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new flight (operator/admin)
app.post("/api/flights", authMiddleware, async (req, res) => {
  try {
    const { flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats } = req.body;
    const flight = new Flight({
      flightName, flightId, origin, destination, departureTime, arrivalTime,
      basePrice, totalSeats, availableSeats: totalSeats,
      operatorId: req.user.id
    });
    await flight.save();
    res.status(201).json({ message: "Flight added successfully", flight });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update flight (operator/admin)
app.put("/api/flights/:id", authMiddleware, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json({ message: "Flight updated", flight });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete flight (admin)
app.delete("/api/flights/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.json({ message: "Flight deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get operator's bookings (bookings for their flights)
app.get("/api/operator/bookings", authMiddleware, async (req, res) => {
  try {
    const flights = await Flight.find({ operatorId: req.user.id });
    const flightIds = flights.map(f => f._id);
    const bookings = await Booking.find({ flight: { $in: flightIds } }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get operator's flights
app.get("/api/operator/flights", authMiddleware, async (req, res) => {
  try {
    const flights = await Flight.find({ operatorId: req.user.id });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ============ BOOKING ROUTES ============

// Create booking
app.post("/api/bookings", authMiddleware, async (req, res) => {
  try {
    const {
      flightDbId, flightId, flightName,
      departure, destination, email, mobile,
      seats, passengers, totalPrice,
      journeyDate, journeyTime, seatClass,
    } = req.body;

    const booking = new Booking({
      user:        req.user.id,
      flight:      flightDbId || undefined,
      flightName, flightId,
      departure, destination,
      email, mobile, seats,
      passengers:  (passengers || []).map(p => ({ name: p.name, age: Number(p.age) })),
      totalPrice:  Number(totalPrice),
      journeyDate: journeyDate ? new Date(journeyDate) : undefined,
      journeyTime,
      seatClass:   seatClass || "economy",
    });
    await booking.save();

    // Decrement available seats (count comma-separated seat codes)
    if (flightDbId) {
      const seatCount = seats ? seats.split(",").length : 1;
      await Flight.findByIdAndUpdate(flightDbId, { $inc: { availableSeats: -seatCount } });
    }

    res.status(201).json({ message: "Booking confirmed!", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user bookings
app.get("/api/bookings/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("flight");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel booking (traveler cancels own / admin cancels any)
app.put("/api/bookings/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.usertype === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user.id };

    const booking = await Booking.findOneAndUpdate(
      filter,
      { bookingStatus: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all bookings (admin)
app.get("/api/admin/bookings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "username email").populate("flight");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ============ USER ROUTES (Admin) ============

// Get all users
app.get("/api/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve operator
app.put("/api/admin/users/:id/approve", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { approval: "approved" }, { new: true }).select("-password");
    res.json({ message: "User approved", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Dashboard stats (admin)
app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.countDocuments({ usertype: "traveler" });
    const bookings = await Booking.countDocuments();
    const flights = await Flight.countDocuments();
    const operators = await User.find({ usertype: "operator", approval: "pending" });
    res.json({ users, bookings, flights, pendingOperators: operators });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Operator dashboard stats
app.get("/api/operator/stats", authMiddleware, async (req, res) => {
  try {
    const flights = await Flight.find({ operatorId: req.user.id });
    const flightIds = flights.map(f => f._id);
    const bookings = await Booking.countDocuments({ flight: { $in: flightIds } });
    res.json({ flights: flights.length, bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Connect DB and start server
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running @ ${PORT}`);
      console.log(`✅ MongoDB connected`);
    });
  })
  .catch(err => console.log("Error: ", err));

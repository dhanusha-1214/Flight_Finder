/**
 * FlightFinder — Full Database Seed
 * Run: node seed.js
 *
 * Creates:
 *  • 1 Admin
 *  • 1 Operator (IndiGo — approved)
 *  • 1 Operator (Spicejet — approved)
 *  • 2 Travelers (Alex, Harsha)
 *  • 7 Flights
 *  • 6 Bookings (confirmed + cancelled)
 */

import mongoose from "mongoose";
import bcrypt   from "bcrypt";
import dotenv   from "dotenv";
import { User, Flight, Booking } from "./schemas.js";

dotenv.config();

const MONGO = process.env.MONGO_URL || "mongodb://localhost:27017/flightfinder";

const hash = pw => bcrypt.hash(pw, 10);
const pad  = n  => String(n).padStart(2, "0");

async function seed() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("✅ MongoDB connected");

  // Clear everything
  await Promise.all([User.deleteMany({}), Flight.deleteMany({}), Booking.deleteMany({})]);
  console.log("🗑️  Cleared existing data");

  // ── USERS ──────────────────────────────────────────────
  const [adminPw, op1Pw, op2Pw, t1Pw, t2Pw] = await Promise.all([
    hash("admin123"), hash("indigo123"), hash("spicejet123"), hash("alex123"), hash("harsha123"),
  ]);

  const admin = await User.create({
    username: "Admin", email: "admin@ff.com",
    password: adminPw, usertype: "admin", approval: "approved",
  });

  const op1 = await User.create({
    username: "Indigo", email: "indigo@ff.com",
    password: op1Pw, usertype: "operator", approval: "approved",
  });

  const op2 = await User.create({
    username: "Spicejet", email: "spicejet@ff.com",
    password: op2Pw, usertype: "operator", approval: "approved",
  });

  const traveler1 = await User.create({
    username: "Alex", email: "alex@ff.com",
    password: t1Pw, usertype: "traveler", approval: "approved",
  });

  const traveler2 = await User.create({
    username: "Harsha", email: "harsha@ff.com",
    password: t2Pw, usertype: "traveler", approval: "approved",
  });

  console.log("👥 Created 5 users (1 admin, 2 operators, 2 travelers)");

  // ── FLIGHTS ─────────────────────────────────────────────
  const flights = await Flight.insertMany([
    {
      flightName: "Indigo", flightId: "6E-201",
      origin: "Chennai", destination: "Banglore",
      departureTime: "18:40", arrivalTime: "20:00",
      basePrice: 3600, totalSeats: 180, availableSeats: 178,
      operatorId: op1._id,
    },
    {
      flightName: "Indigo", flightId: "6E-502",
      origin: "Delhi", destination: "Mumbai",
      departureTime: "08:00", arrivalTime: "10:15",
      basePrice: 4200, totalSeats: 180, availableSeats: 180,
      operatorId: op1._id,
    },
    {
      flightName: "Indigo", flightId: "6E-803",
      origin: "Mumbai", destination: "Kolkata",
      departureTime: "14:30", arrivalTime: "17:10",
      basePrice: 5100, totalSeats: 180, availableSeats: 180,
      operatorId: op1._id,
    },
    {
      flightName: "Spicejet", flightId: "SG-102",
      origin: "Hyderabad", destination: "Banglore",
      departureTime: "20:15", arrivalTime: "21:30",
      basePrice: 2800, totalSeats: 150, availableSeats: 147,
      operatorId: op2._id,
    },
    {
      flightName: "Air Vistara", flightId: "UK-821",
      origin: "Delhi", destination: "Kolkata",
      departureTime: "18:00", arrivalTime: "20:30",
      basePrice: 4200, totalSeats: 160, availableSeats: 159,
      operatorId: op2._id,
    },
    {
      flightName: "Air India", flightId: "AI-301",
      origin: "Mumbai", destination: "New York",
      departureTime: "23:00", arrivalTime: "06:30",
      basePrice: 85000, totalSeats: 250, availableSeats: 250,
      operatorId: op1._id,
    },
    {
      flightName: "Emirates", flightId: "EK-505",
      origin: "Delhi", destination: "Paris",
      departureTime: "02:30", arrivalTime: "09:15",
      basePrice: 68000, totalSeats: 300, availableSeats: 300,
      operatorId: op2._id,
    },
  ]);
  console.log(`✈️  Created ${flights.length} flights`);

  // ── BOOKINGS ─────────────────────────────────────────────
  const baseDate = new Date("2023-08-28");

  await Booking.insertMany([
    // Booking 1 — Harsha — Indigo Chennai→Banglore — CONFIRMED
    {
      user:          traveler2._id,
      flight:        flights[0]._id,
      flightName:    "Indigo",
      flightId:      "6E-201",
      departure:     "Chennai",
      destination:   "Banglore",
      email:         "harsha@gmail.com",
      mobile:        "7669678988",
      seats:         "B-1, B-2",
      passengers:    [{ name: "Alex", age: 44 }, { name: "Snyder", age: 55 }],
      totalPrice:    7200,
      journeyDate:   new Date("2023-08-31"),
      journeyTime:   "18:40",
      seatClass:     "business",
      bookingStatus: "confirmed",
    },
    // Booking 2 — Alex — Spicejet Hyderabad→Banglore — CANCELLED
    {
      user:          traveler1._id,
      flight:        flights[3]._id,
      flightName:    "Spicejet",
      flightId:      "SG-102",
      departure:     "Hyderabad",
      destination:   "Banglore",
      email:         "simon@gmail.com",
      mobile:        "7869868765",
      seats:         "B-1, B-2, B-3",
      passengers:    [
        { name: "Jack", age: 23 },
        { name: "Alex", age: 33 },
        { name: "John", age: 43 },
      ],
      totalPrice:    17100,
      journeyDate:   new Date("2023-08-31"),
      journeyTime:   "20:15",
      seatClass:     "business",
      bookingStatus: "cancelled",
    },
    // Booking 3 — Alex — Air Vistara Delhi→Kolkata — CONFIRMED
    {
      user:          traveler1._id,
      flight:        flights[4]._id,
      flightName:    "Air Vistara",
      flightId:      "UK-821",
      departure:     "Delhi",
      destination:   "Kolkata",
      email:         "user@gmail.com",
      mobile:        "9993478322",
      seats:         "P-1",
      passengers:    [{ name: "Alex", age: 32 }],
      totalPrice:    4200,
      journeyDate:   new Date("2023-08-29"),
      journeyTime:   "18:00",
      seatClass:     "economy",
      bookingStatus: "confirmed",
    },
    // Booking 4 — Harsha — Indigo Chennai→Banglore — CONFIRMED
    {
      user:          traveler2._id,
      flight:        flights[0]._id,
      flightName:    "Indigo",
      flightId:      "6E-201",
      departure:     "Chennai",
      destination:   "Banglore",
      email:         "harsha@gmail.com",
      mobile:        "7669678988",
      seats:         "E-1",
      passengers:    [{ name: "Harsha", age: 28 }],
      totalPrice:    3600,
      journeyDate:   new Date("2023-09-05"),
      journeyTime:   "18:40",
      seatClass:     "economy",
      bookingStatus: "confirmed",
    },
    // Booking 5 — Alex — Spicejet Hyderabad→Banglore — CONFIRMED
    {
      user:          traveler1._id,
      flight:        flights[3]._id,
      flightName:    "Spicejet",
      flightId:      "SG-102",
      departure:     "Hyderabad",
      destination:   "Banglore",
      email:         "alex@gmail.com",
      mobile:        "9876543210",
      seats:         "E-1, E-2",
      passengers:    [{ name: "Alex", age: 33 }, { name: "Priya", age: 30 }],
      totalPrice:    5600,
      journeyDate:   new Date("2023-09-10"),
      journeyTime:   "20:15",
      seatClass:     "economy",
      bookingStatus: "confirmed",
    },
    // Booking 6 — Harsha — Indigo Delhi→Mumbai — CONFIRMED
    {
      user:          traveler2._id,
      flight:        flights[1]._id,
      flightName:    "Indigo",
      flightId:      "6E-502",
      departure:     "Delhi",
      destination:   "Mumbai",
      email:         "harsha@gmail.com",
      mobile:        "7669678988",
      seats:         "B-1",
      passengers:    [{ name: "Harsha", age: 28 }],
      totalPrice:    10500,
      journeyDate:   new Date("2023-09-15"),
      journeyTime:   "08:00",
      seatClass:     "business",
      bookingStatus: "confirmed",
    },
  ]);
  console.log("🎫 Created 6 bookings");

  console.log("\n🎉 Seed complete!\n");
  console.log("════════════════════════════════════════");
  console.log("  Login Credentials");
  console.log("════════════════════════════════════════");
  console.log("  👑 Admin:    admin@ff.com     / admin123");
  console.log("  ✈️  Operator: indigo@ff.com    / indigo123");
  console.log("  ✈️  Operator: spicejet@ff.com  / spicejet123");
  console.log("  👤 Traveler: alex@ff.com      / alex123");
  console.log("  👤 Traveler: harsha@ff.com    / harsha123");
  console.log("════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});

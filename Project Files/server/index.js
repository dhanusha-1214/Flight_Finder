import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { User, Flight, Booking } from './schemas.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MONGO_URL = 'mongodb://127.0.0.1:27017/flightBooking';
const PORT = 6001;

// 1. Registration Route
app.post('/register', async (req, res) => {
    try {
        const { username, email, usertype, password } = req.body;
        const newUser = new User({ username, email, usertype, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 2. Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.status(200).json({ 
                message: "Login Successful", 
                user: { username: user.username, usertype: user.usertype, email: user.email, _id: user._id } 
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Flight Routes
app.get('/all-flights', async (req, res) => {
    try {
        const flights = await Flight.find();
        res.json(flights);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Booking Routes
app.post('/book-flight', async (req, res) => {
    try {
        const { userId, flightId } = req.body;
        const newBooking = new Booking({
            user: userId,
            flight: flightId,
            status: "Confirmed"
        });
        await newBooking.save();
        res.status(201).json({ message: "Flight Booked Successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user-bookings/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).populate('flight');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Seed Route (For browser access)
app.get('/seed', async (req, res) => {
    try {
        const sample = [
            { flightName: "Air India", flightId: "AI-101", origin: "Delhi", destination: "Paris", departureTime: "10:00 AM", arrivalTime: "10:00 PM", basePrice: 45000, totalSeats: 200 },
            { flightName: "IndiGo", flightId: "6E-502", origin: "Anantapur", destination: "Bangalore", departureTime: "08:00 AM", arrivalTime: "09:30 AM", basePrice: 3000, totalSeats: 180 }
        ];
        await Flight.deleteMany({}); 
        await Flight.insertMany(sample);
        res.send("<h1>Data Seeded Successfully!</h1>");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

mongoose.connect(MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`Running @ ${PORT}`));
}).catch((err) => console.log(`Error: ${err}`));
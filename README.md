# ✈️ FlightFinder — MERN Stack Flight Booking App

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.4-47A248?style=flat-square&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> A full-stack flight booking web application with role-based dashboards for **Admins**, **Operators**, and **Travelers** — built on the MERN stack with JWT authentication.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Repository Structure](#-repository-structure)
- [Tech Stack](#-tech-stack)
- [Features by Role](#-features-by-role)
- [Getting Started](#-getting-started)
- [Login Credentials](#-login-credentials-after-seeding)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

**FlightFinder** is a full-stack flight booking platform where travelers can search and book flights, operators can manage their flight routes, and admins have complete control over the platform. The app features secure JWT-based authentication, role-based access control, and real-time seat availability tracking.

---

## 📂 Repository Structure

```
Flight_Finder/
├── 📁 Demo Video/
│   └── Demo.mp4                  ← App walkthrough video
├── 📁 Document/
│   └── Flight_Finder.pdf         ← Project documentation
└── 📁 Project Files/             ← Full source code (MERN app)
    ├── 📁 client/                ← React.js frontend (port 3000)
    │   ├── public/
    │   └── src/
    │       ├── components/       ← Navbar, BookingModal, ProtectedRoute
    │       ├── context/          ← JWT AuthContext
    │       ├── pages/            ← All page components
    │       ├── styles/           ← global.css
    │       └── utils/            ← Axios API helper
    ├── 📁 server/                ← Node.js + Express backend (port 6001)
    │   ├── index.js              ← All API routes
    │   ├── schemas.js            ← Mongoose models
    │   ├── seed.js               ← Database seeder
    │   └── .env                  ← Environment config
    └── package.json
```

> 📖 For detailed code-level documentation, see [`Project Files/README.md`](./Project%20Files/README.md)

---

## 🏗️ Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React.js 18, React Router v6, Axios, Bootstrap 5  |
| Backend    | Node.js 18+, Express.js 4.18                      |
| Database   | MongoDB + Mongoose 7.4                            |
| Auth       | JWT (JSON Web Tokens) + bcrypt 5.1                |
| Dev Tools  | Nodemon, React Scripts                            |
| Styling    | Custom CSS (Inter font, light theme)              |

---

## 👥 Features by Role

### 👤 Traveler
- 🔍 Search flights by origin & destination city
- 🎫 Book flights with seat class, passenger details & mobile number
- 📋 View all personal bookings with full details
- ❌ Cancel confirmed tickets
- 📊 Personal dashboard with booking statistics

### ✈️ Operator
- 📊 Dashboard overview (bookings, flights, new activity)
- ➕ Add new flight routes
- 🛠️ View and edit own flights
- 📋 View bookings made on own flights
- ✅ Account requires Admin approval before activation

### 👑 Admin
- 📊 Platform-wide stats (total users, bookings, flights)
- ✅ Approve pending Operator applications
- 👤 View and manage all users (Travelers + Operators)
- 📋 View and cancel any booking across the platform
- 🗑️ View and delete any flight

---

## 🚀 Getting Started

### Prerequisites

- **Node.js v18+** → [Download](https://nodejs.org)
- **MongoDB** (running locally) → [Download](https://www.mongodb.com/try/download/community)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/dhanusha-1214/Flight_Finder.git
cd Flight_Finder/Project\ Files
```

### Step 2 — Start MongoDB

```bash
# Windows (Admin PowerShell)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 3 — Setup & Run the Backend

```bash
cd server
npm install
```

Edit `.env` if needed:

```env
PORT=6001
MONGO_URL=mongodb://localhost:27017/flightfinder
JWT_SECRET=flightfinder_super_secret_2024
```

Seed the database with test data:

```bash
node seed.js
```

Start the server:

```bash
npm run dev        # with auto-restart (nodemon)
# OR
npm start          # standard start
```

Expected output:
```
✅ Server running @ 6001
✅ MongoDB connected
```

### Step 4 — Setup & Run the Frontend

```bash
cd ../client
npm install
npm start          # Opens http://localhost:3000
```

---

## 🔑 Login Credentials (after seeding)

| Role     | Email              | Password    | Redirects to  |
|----------|--------------------|-------------|---------------|
| Admin    | admin@ff.com       | admin123    | `/admin`      |
| Operator | indigo@ff.com      | indigo123   | `/operator`   |
| Operator | spicejet@ff.com    | spicejet123 | `/operator`   |
| Traveler | alex@ff.com        | alex123     | `/dashboard`  |
| Traveler | harsha@ff.com      | harsha123   | `/dashboard`  |

---

## 🛠️ API Reference

### Auth
| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| POST   | `/api/auth/register` | Register (Traveler / Operator) |
| POST   | `/api/auth/login`    | Login → returns JWT            |

### Flights
| Method | Endpoint                                    | Auth           | Description              |
|--------|---------------------------------------------|----------------|--------------------------|
| GET    | `/api/flights`                              | Public         | All flights              |
| GET    | `/api/flights/search?origin=&destination=`  | Public         | Search flights           |
| GET    | `/api/flights/:id`                          | Public         | Single flight            |
| POST   | `/api/flights`                              | Operator/Admin | Add flight               |
| PUT    | `/api/flights/:id`                          | Operator/Admin | Update flight            |
| DELETE | `/api/flights/:id`                          | Admin only     | Delete flight            |
| GET    | `/api/operator/flights`                     | Operator       | Own flights              |
| GET    | `/api/operator/stats`                       | Operator       | Dashboard stats          |
| GET    | `/api/operator/bookings`                    | Operator       | Bookings for own flights |

### Bookings
| Method | Endpoint                   | Auth           | Description    |
|--------|----------------------------|----------------|----------------|
| POST   | `/api/bookings`            | Traveler       | Create booking |
| GET    | `/api/bookings/my`         | Traveler       | Own bookings   |
| PUT    | `/api/bookings/:id/cancel` | Traveler/Admin | Cancel booking |
| GET    | `/api/admin/bookings`      | Admin          | All bookings   |

### Admin
| Method | Endpoint                       | Auth  | Description         |
|--------|--------------------------------|-------|---------------------|
| GET    | `/api/admin/stats`             | Admin | Dashboard stats     |
| GET    | `/api/admin/users`             | Admin | All users           |
| PUT    | `/api/admin/users/:id/approve` | Admin | Approve operator    |

---

## 🗄️ Database Schema

### Users
```js
{ username, email, password (bcrypt hashed), usertype, approval, timestamps }
```

### Flights
```js
{ flightName, flightId, origin, destination, departureTime, arrivalTime,
  basePrice, totalSeats, availableSeats, operatorId (ref: User), timestamps }
```

### Bookings
```js
{ user (ref), flight (ref), flightName, flightId, departure, destination,
  email, mobile, seats ("B-1, B-2"), passengers [{ name, age }],
  totalPrice, bookingDate, journeyDate, journeyTime, seatClass,
  bookingStatus ("confirmed" | "cancelled"), timestamps }
```

---

## 🎨 Design System

| Token         | Value                  |
|---------------|------------------------|
| Primary color | `#2563eb` — Blue       |
| Success       | `#10b981` — Green      |
| Danger        | `#ef4444` — Red        |
| Background    | `#f1f5f9` — Light Gray |
| Navbar        | `#1e293b` — Dark Navy  |
| Font          | Inter (Google Fonts)   |

---

## ⚡ Troubleshooting

| Problem                             | Solution                                                                      |
|-------------------------------------|-------------------------------------------------------------------------------|
| `MongoDB connection refused`        | Start MongoDB: `net start MongoDB` or `brew services start mongodb-community` |
| `Port 6001 already in use`          | Change `PORT=6002` in `server/.env`                                           |
| Blank page / white screen           | Open browser console (F12) and check for errors                               |
| "Account pending approval" on login | Re-run `node seed.js`, or approve via Admin → Users                           |
| API returns 401 Unauthorized        | Token expired — log out and log back in                                       |
| `npm install` fails                 | Delete `node_modules/` and `package-lock.json`, then retry                    |

---

## 📄 License

This project is licensed under the **MIT License**.

---

*Built with ❤️ using the MERN Stack — MongoDB · Express · React · Node.js*

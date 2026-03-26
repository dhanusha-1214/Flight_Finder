# ✈️ FlightFinder — MERN Stack Flight Booking App

A full-stack flight booking application built with **MongoDB, Express.js, React.js, and Node.js** with three role-based dashboards: **Admin**, **Operator**, and **Traveler**.

---

## 🏗️ Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React.js 18, React Router v6, Axios         |
| Backend   | Node.js, Express.js                         |
| Database  | MongoDB + Mongoose                          |
| Auth      | JWT (JSON Web Tokens) + bcrypt              |
| Styling   | Custom CSS (Inter font, light theme)        |

---

## 📁 Project Structure

```
FlightFinder/
├── client/                         ← React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js           ← Role-aware navigation bar
│       │   ├── BookingModal.js     ← Flight booking form
│       │   └── ProtectedRoute.js  ← Auth + role guard
│       ├── context/
│       │   └── AuthContext.js      ← JWT auth state (login/logout)
│       ├── pages/
│       │   ├── Home.js             ← Landing page with hero + search
│       │   ├── Login.js            ← Sign in page
│       │   ├── Register.js         ← Sign up (Traveler / Operator)
│       │   ├── Search.js           ← Flight search & results
│       │   ├── Bookings.js         ← My bookings + Cancel Ticket
│       │   ├── Dashboard.js        ← Traveler dashboard
│       │   ├── AdminDashboard.js   ← Admin panel (nested routes)
│       │   └── OperatorDashboard.js← Operator panel (nested routes)
│       ├── styles/
│       │   └── global.css          ← All styles
│       ├── utils/
│       │   └── api.js              ← Axios with JWT interceptor
│       ├── App.js                  ← All routes
│       └── index.js                ← Entry point
│
└── server/                         ← Node.js + Express backend
    ├── index.js                    ← All API routes
    ├── schemas.js                  ← Mongoose models (User, Flight, Booking)
    ├── seed.js                     ← Database seeder
    ├── .env                        ← Environment variables
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js v18+** — https://nodejs.org
- **MongoDB** running locally — https://www.mongodb.com/try/download/community

### 1 — Clone / Extract
```bash
cd FlightFinder
```

### 2 — Start MongoDB
```bash
# Windows (admin PowerShell)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 3 — Setup Backend
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
npm run dev          # auto-restart with nodemon
# OR
npm start            # standard start
```

You should see:
```
✅ Server running @ 6001
✅ MongoDB connected
```

### 4 — Setup Frontend
```bash
cd ../client
npm install
npm start            # opens http://localhost:3000
```

---

## 🔑 Login Credentials (after seeding)

| Role     | Email                | Password     | Redirects to     |
|----------|----------------------|--------------|------------------|
| Admin    | admin@ff.com         | admin123     | /admin           |
| Operator | indigo@ff.com        | indigo123    | /operator        |
| Operator | spicejet@ff.com      | spicejet123  | /operator        |
| Traveler | alex@ff.com          | alex123      | /dashboard       |
| Traveler | harsha@ff.com        | harsha123    | /dashboard       |

---

## 👥 Role-Based Features

### 👤 Traveler
| Feature | Path |
|---|---|
| Browse landing page with hero search | `/` |
| Search flights by city | `/search` |
| Book a flight (seat class, passengers, mobile) | BookingModal |
| View all bookings with full details | `/bookings` |
| Cancel confirmed tickets | `/bookings` |
| Personal dashboard with stats | `/dashboard` |

**Navbar**: Home · Bookings · Logout

---

### ✈️ Operator
| Feature | Path |
|---|---|
| Overview: Bookings / Flights / New Flight stats | `/operator` |
| Add a new flight route | `/operator/add-flight` |
| View & edit all own flights | `/operator/flights` |
| View bookings for own flights | `/operator/bookings` |

**Navbar**: FlightFinder (Operator) · Home · Bookings · Flights · Add Flight · Logout

---

### 👑 Admin
| Feature | Path |
|---|---|
| Overview: Users / Bookings / Flights counts | `/admin` |
| New Operator Applications (approve pending) | `/admin` |
| View all Travelers + Flight Operators | `/admin/users` |
| View all bookings (all users), cancel any | `/admin/bookings` |
| View all flights, delete flights | `/admin/flights` |

**Navbar**: FlightFinder (Admin) · Home · Users · Bookings · Flights · Logout

---

## 🛠️ API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register (traveler / operator) |
| POST | `/api/auth/login` | Login → returns JWT |

### Flights (public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/flights` | All flights |
| GET | `/api/flights/search?origin=&destination=` | Search by city |
| GET | `/api/flights/:id` | Single flight |

### Flights (protected)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/flights` | Operator/Admin | Add new flight |
| PUT | `/api/flights/:id` | Operator/Admin | Update flight |
| DELETE | `/api/flights/:id` | Admin only | Delete flight |
| GET | `/api/operator/flights` | Operator | Own flights |
| GET | `/api/operator/stats` | Operator | Dashboard counts |
| GET | `/api/operator/bookings` | Operator | Bookings for own flights |

### Bookings
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/bookings` | Traveler | Create booking |
| GET | `/api/bookings/my` | Traveler | Own bookings |
| PUT | `/api/bookings/:id/cancel` | Traveler/Admin | Cancel booking |
| GET | `/api/admin/bookings` | Admin | All bookings |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | All users |
| PUT | `/api/admin/users/:id/approve` | Admin | Approve operator |

---

## 📱 Pages Summary

| Page | Route | Who Sees It |
|---|---|---|
| Landing Page | `/` | Everyone |
| Login | `/login` | Everyone |
| Register | `/register` | Everyone |
| Search Flights | `/search` | Everyone |
| Traveler Dashboard | `/dashboard` | Traveler |
| My Bookings | `/bookings` | Traveler |
| Admin Home | `/admin` | Admin |
| Admin — All Users | `/admin/users` | Admin |
| Admin — All Bookings | `/admin/bookings` | Admin |
| Admin — All Flights | `/admin/flights` | Admin |
| Operator Home | `/operator` | Operator |
| Add New Flight | `/operator/add-flight` | Operator |
| Operator Flights | `/operator/flights` | Operator |
| Operator Bookings | `/operator/bookings` | Operator |

---

## 🗄️ Database Collections

### Users
```js
{ username, email, password (hashed), usertype, approval, timestamps }
```

### Flights
```js
{ flightName, flightId, origin, destination, departureTime, arrivalTime,
  basePrice, totalSeats, availableSeats, operatorId (ref User), timestamps }
```

### Bookings
```js
{ user (ref), flight (ref), flightName, flightId, departure, destination,
  email, mobile, seats ("B-1, B-2"), passengers [{name, age}],
  totalPrice, bookingDate, journeyDate, journeyTime, seatClass,
  bookingStatus ("confirmed"|"cancelled"), timestamps }
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary color | `#2563eb` (blue) |
| Success | `#10b981` (green) |
| Danger | `#ef4444` (red) |
| Background | `#f1f5f9` (light gray) |
| Navbar | `#1e293b` (dark navy) |
| Font | Inter (Google Fonts) |

---

## ⚡ Quick Troubleshooting

| Problem | Solution |
|---|---|
| `MongoDB connection refused` | Start MongoDB: `net start MongoDB` or `brew services start mongodb-community` |
| `Port 6001 already in use` | Change `PORT=6002` in `server/.env` |
| Blank page / white screen | Open browser console (F12) → check for errors |
| Login says "Account pending approval" | Run seed again, or approve in Admin → Users |
| API returns 401 | Token expired → log out and log back in |
| `npm install` fails | Delete `node_modules/` and `package-lock.json`, then retry |

---

*Built with the MERN Stack — MongoDB · Express · React · Node.js*

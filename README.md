## ✈️ Flight Finder: Navigating Your Air Travel Options

## 📌 Overview

Flight Finder is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It delivers a high-performance, mobile-responsive platform that enables users to search for flights between cities and persistently save their booking history.

## 🎯 Project Objective
Purpose:
To eliminate friction in air travel discovery by providing a fast, reliable, and user-centric booking interface.
Target Users:
Frequent travelers looking for an intuitive way to manage their itineraries.
Core Problem Solved:
🐢 Slow UI in traditional travel portals
❌ Data loss issues in booking systems

## 🚀 Key Features
🔍 Dynamic Search
Real-time city filtering using dynamic dropdown menus
💾 Persistent Bookings
"My Bookings" dashboard with data stored in MongoDB
📱 Mobile-First Design
Fully responsive UI built using Bootstrap
⚙️ Admin Seeding
Predefined routes to populate the system with flight data
## 🛠️ Technology Stack
**💻 Frontend**
React.js (Functional Components & Hooks)
Bootstrap
CSS3
**🔧 Backend**
Node.js
Express.js (RESTful APIs)
**🗄️ Database**
MongoDB Atlas
Mongoose ODM
**🚀 Deployment**
Render / Vercel

## 🏗️ System Architecture
This application follows a 3-Tier Architecture:
**Presentation Layer**
Built using React.js
Handles UI and user interactions
**Application Layer**
Node.js & Express.js
Manages business logic and API routing
**Data Layer**
MongoDB Atlas
Stores flight and booking data

## ⚙️ Setup & Installation
**✅ Prerequisites**
Node.js (v16 or higher)
npm or yarn
**MongoDB Atlas account**
📥 Clone Repository
git clone https://github.com/your-username/flight-finder.git
cd flight-finder

## 📦 Install Dependencies
**Backend:**
cd server
npm install
**Frontend:**
cd ../client
npm install
**🔐 Environment Variables**
Create a .env file in the /server directory:
MONGODB_URI=your_mongodb_connection_string
PORT=5000

## ▶️ Run the Application
**Start Backend:**
cd server
npm start
**Start Frontend:**
cd client
npm start
**📡 API Endpoints**

## Method	Endpoint	Description
GET	/api/flights	Fetch flights based on search criteria
POST	/api/book	Save selected flight to user bookings
GET	/api/seed	Populate database with sample flight data (Admin)

## 📂 Folder Structure
flight-finder/
│
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       └── pages/          # Search & Dashboard views
│
└── server/                 # Node.js Backend
    ├── models/             # Mongoose Schemas
    ├── routes/             # API routes
    └── server.js           # Entry point

## 🧪 Testing & Quality Assurance
**✅ Unit Testing:**
API endpoints tested using Postman
**✅ Functional Testing:**
100% success rate on search and booking features
**✅ User Acceptance Testing (UAT):**
Conducted based on empathy mapping

## 🔮 Future Enhancements
✈️ Real-time flight API integration (e.g., Amadeus)
🔐 JWT-based authentication system
💳 Payment gateway integration (Stripe)
📊 Advanced analytics dashboard
🌐 Multi-language support

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Dhanusha Avvari**

* GitHub: [https://github.com/dhanusha-1214](https://github.com/dhanusha-1214)
* LinkedIn: [https://linkedin.com/in/dhanusha-avvari](https://linkedin.com/in/dhanusha-avvari)

---

## ⭐ Acknowledgements

* MERN Stack Documentation
* Open-source community

---

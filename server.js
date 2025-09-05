// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://budiepeds_db_user:JcEDYQbe3HxJx9od@cluster0.ftqvicj.mongodb.net/bookingApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 🔹 Schema (added name + phone)
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },   // 👈 new
  phone: { type: String, required: true },  // 👈 new
  date: String,
  persons: Number,
  place: String,
  orders: Number,
  menu: String,
});

// Model
const Booking = mongoose.model("Booking", bookingSchema);

// 🔹 GET all bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 POST a new booking
app.post("/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});


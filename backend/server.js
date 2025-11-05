import dotenv from "dotenv";
dotenv.config(); // ✅ must be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Car from "./models/Car.js";
import User from "./models/User.js";
import Favorite from "./models/Favorite.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Loaded MONGO_URI:", process.env.MONGO_URI);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===== ROUTES =====

// Default route
app.get("/", (req, res) => {
  res.send("CarVerse API is running 🚗");
});

// ---------- Cars ----------
app.get("/api/cars", async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
});

// Add car (for admin use)
app.post("/api/cars", async (req, res) => {
  const newCar = new Car(req.body);
  await newCar.save();
  res.json({ message: "Car added!", car: newCar });
});

// ---------- User Authentication ----------
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();

  res.json({ message: "User registered successfully!" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});
import Review from "./models/Review.js"; // add this near top

// ---------- Reviews ----------
// Add a review
app.post("/api/reviews", async (req, res) => {
  try {
    const { carId, userId, userName, rating, comment } = req.body;
    const review = new Review({ carId, userId, userName, rating, comment });
    await review.save();
    res.json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

// Get all reviews for a specific car
app.get("/api/reviews/:carId", async (req, res) => {
  try {
    const reviews = await Review.find({ carId: req.params.carId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ---------- Favorites ----------
app.post("/api/favorites", async (req, res) => {
  const { userId, carId } = req.body;
  const fav = await Favorite.findOne({ userId, carId });
  if (fav) {
    await Favorite.deleteOne({ userId, carId });
    return res.json({ message: "Removed from favorites" });
  }
  const newFav = new Favorite({ userId, carId });
  await newFav.save();
  res.json({ message: "Added to favorites", favorite: newFav });
});

app.get("/api/favorites/:userId", async (req, res) => {
  const favorites = await Favorite.find({ userId: req.params.userId }).populate("carId");
  res.json(favorites);
});

// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


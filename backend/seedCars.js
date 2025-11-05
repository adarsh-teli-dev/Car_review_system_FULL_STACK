import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "./models/Car.js";
import { carsData } from "./data/CarsData.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carverse";

async function seedCars() {
  try {
    console.log("🌱 Starting seed process...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Car.deleteMany();
    await Car.insertMany(carsData);

    console.log(`🚗 Successfully inserted ${carsData.length} cars.`);
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting cars:", err);
    mongoose.connection.close();
  }
}

seedCars();

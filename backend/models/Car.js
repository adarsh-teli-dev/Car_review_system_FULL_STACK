import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  brand: String,
  color: String,
  fuel: String,
  price: Number,
  seats: Number,
  engine: String,
  transmission: String,
  topSpeed: String,
  acceleration: String,
  torque: String,
  horsepower: String,
  bootSpace: String,
  image: String,
});

export default mongoose.model("Car", carSchema);

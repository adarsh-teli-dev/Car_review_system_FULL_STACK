import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
});

export default mongoose.model("Favorite", favoriteSchema);

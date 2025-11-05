import React from "react";
import "../App.css";

export default function CarCard({ car, onClick, isFavorite, onToggleFavorite }) {
  const carId = car._id || car.id; // ✅ Use MongoDB _id or fallback to local id

  return (
    <div className="car-card">
      <div className="car-image" onClick={onClick}>
        <img src={car.image} alt={car.brand} />
      </div>

      <div className="car-info">
        <h3>{car.brand}</h3>
        <p>{car.color}</p>
      </div>

      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={() => onToggleFavorite(carId)} // ✅ Pass correct id
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

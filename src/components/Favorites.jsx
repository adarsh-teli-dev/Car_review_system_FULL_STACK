import React from "react";
import "./Favorites.css";
import CarCard from "./CarCard";

export default function Favorites({ favorites, carsData, onToggleFavorite, onSelectCar }) {
  // ✅ Match either _id (from MongoDB) or id (from local data)
  const favoriteCars = carsData.filter(car => favorites.includes(car._id || car.id));

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>❤️ My Favorite Cars</h1>
        <p className="favorites-count">
          {favoriteCars.length} {favoriteCars.length === 1 ? "car" : "cars"} saved
        </p>
      </div>

      {favoriteCars.length > 0 ? (
        <div className="favorites-grid">
          {favoriteCars.map((car) => (
            <div key={car._id || car.id}>
              {/* ✅ Removed “X” — only shows car image and info */}
              <CarCard
                car={car}
                onClick={() => onSelectCar(car)}
                isFavorite={true}
                onToggleFavorite={() => {}} // Disable un-fav from here
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="no-favorites">
          <div className="no-favorites-icon">💔</div>
          <h2>No Favorites Yet</h2>
          <p>Start adding cars to your favorites by clicking the heart icon!</p>
          <button className="browse-btn" onClick={() => window.location.reload()}>
            Browse Cars
          </button>
        </div>
      )}
    </div>
  );
}

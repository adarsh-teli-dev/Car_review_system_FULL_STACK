import React, { useState, useEffect } from "react";
import "./CarModal.css";

export default function CarModal({ car, onClose, user }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  // 🧠 Load reviews for the selected car from localStorage
  useEffect(() => {
    if (car) {
      const saved = JSON.parse(localStorage.getItem(`reviews_${car._id || car.id}`)) || [];
      setReviews(saved);
    }
  }, [car]);

  if (!car) return null;

  // 💬 Add new review
  const handleAddReview = () => {
    if (!newReview.trim()) return;

    const updatedReviews = [
      ...reviews,
      {
        user: user?.name || "Anonymous",
        text: newReview.trim(),
        date: new Date().toLocaleString(),
      },
    ];

    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${car._id || car.id}`, JSON.stringify(updatedReviews));
    setNewReview("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <div className="modal-body">
          {/* Left: Image */}
          <div className="car-image">
            <img src={car.image} alt={car.brand} />
          </div>

          {/* Right: Specs */}
          <div className="car-details">
            <h2>{car.brand}</h2>
            <ul className="car-specs">
  <li>⚡ <strong>Fuel:</strong> {car.fuel}</li>
  <li>🎨 <strong>Color:</strong> {car.color}</li>
  <li>🪑 <strong>Seats:</strong> {car.seats}</li>
  <li>💰 <strong>Price:</strong> ${car.price}</li>
  <li>🔧 <strong>Engine:</strong> {car.engine || "N/A"}</li>
  <li>⚙️ <strong>Transmission:</strong> {car.transmission || "N/A"}</li>
  <li>🚀 <strong>Top Speed:</strong> {car.topSpeed || "N/A"}</li>
  <li>⏱️ <strong>Acceleration:</strong> {car.acceleration || "N/A"}</li>
  <li>🐎 <strong>Horsepower:</strong> {car.horsepower || "N/A"}</li>
  <li>🧳 <strong>Boot Space:</strong> {car.bootSpace || "N/A"}</li>
</ul>

          </div>
        </div>

        {/* Review Section */}
        <div className="reviews-section">
          <h3>💬 Reviews</h3>

          <div className="review-list">
            {reviews.length > 0 ? (
              reviews.map((r, index) => (
                <div key={index} className="review-item">
                  <p><strong>{r.user}</strong> ({r.date})</p>
                  <p>{r.text}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
          </div>

          <div className="add-review">
            <textarea
              placeholder="Write your review here..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <button onClick={handleAddReview}>Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}

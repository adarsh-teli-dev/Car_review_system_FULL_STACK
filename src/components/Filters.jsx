import React from "react";
import "../App.css";

// All car brands
export const allCarBrands = [
  "Tesla", "BMW", "Audi", "Hyundai", "Kia", "Nissan", "MG", "Maruti",
  "Honda", "Toyota", "Volkswagen", "Tata", "Skoda", "Ford", "Jeep",
  "Renault", "Isuzu", "Lamborghini", "Ferrari", "Rolls Royce", "Bentley",
  "McLaren", "Jaguar", "Aston Martin", "Porsche", "Chevrolet", "Volvo",
  "Mercedes", "Lexus", "Mazda", "Suzuki", "Mahindra"
];

export default function Filters({
  filters,
  onChange,
  uniqueColors,
  searchQuery,
  setSearchQuery,
}) {
  const brandOptions = ["All Brands", ...allCarBrands];
  const colors =
    uniqueColors || [
      "Red",
      "Black",
      "White",
      "Blue",
      "Green",
      "Silver",
      "Gray",
      "Yellow",
      "Orange",
    ];

  return (
    <div className="filters-container">
      <h2>🔍 Filter Cars</h2>

      {/* ✅ Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by brand or model..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="filters">
        {/* Brand Filter */}
        <select name="brand" value={filters.brand} onChange={onChange}>
          {brandOptions.map((brand) => (
            <option
              key={brand}
              value={brand === "All Brands" ? "All" : brand}
            >
              {brand}
            </option>
          ))}
        </select>

        {/* Fuel Filter */}
        <select name="fuel" value={filters.fuel} onChange={onChange}>
          <option value="All">Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {/* Color Filter */}
        <select name="color" value={filters.color} onChange={onChange}>
          <option value="All">All Colors</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={onChange}
        >
          <option value="All">All Prices</option>
          <option value="Low">Below $20,000</option>
          <option value="Medium">$20,000 - $40,000</option>
          <option value="High">Above $40,000</option>
        </select>

        {/* ✅ Seats Filter */}
        <select name="seats" value={filters.seats} onChange={onChange}>
          <option value="All">All Seats</option>
          <option value="2">2 Seats</option>
          <option value="4">4 Seats</option>
          <option value="5">5 Seats</option>
          <option value="7">7 Seats</option>
        </select>
      </div>
    </div>
  );
}

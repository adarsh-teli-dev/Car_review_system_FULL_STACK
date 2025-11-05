import React, { useState, useMemo, useEffect } from "react";
import "./App.css";
import CarCard from "./components/CarCard";
import Filters from "./components/Filters";
import CarModal from "./components/CarModal";
import Login from "./components/Login";
import Favorites from "./components/Favorites";


export default function App() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Page Navigation State
  const [currentPage, setCurrentPage] = useState("home"); // "home" or "favorites"

  // ✅ Car Data from Backend
  const [carsData, setCarsData] = useState([]);

  // Check if user is logged in on mount
  useEffect(() => {
    const currentUser = localStorage.getItem("carverse_current_user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setIsLoading(false);
  }, []);

  // ✅ Fetch cars from backend API
  useEffect(() => {
    fetch("http://localhost:5000/api/cars")
      .then((res) => res.json())
      .then((data) => setCarsData(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  // Filters State (Added Seats)
  const [filters, setFilters] = useState({
    fuel: "All",
    color: "All",
    priceRange: "All",
    brand: "All",
    seats: "All",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCar, setSelectedCar] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.email}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [user]);

  // Save favorites to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset All Filters
  const clearAllFilters = () => {
    setFilters({
      fuel: "All",
      color: "All",
      priceRange: "All",
      brand: "All",
      seats: "All",
    });
    setSearchQuery("");
    setSortBy("default");
  };

  // Toggle Favorites
const toggleFavorite = (car) => {
  const carId = car._id || car.id;
  setFavorites((prev) =>
    prev.includes(carId)
      ? prev.filter((id) => id !== carId)
      : [...prev, carId]
  );
};


  // Logout
  const handleLogout = () => {
    localStorage.removeItem("carverse_current_user");
    setUser(null);
    setFavorites([]);
    setCurrentPage("home");
  };

  // Login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Unique Brand + Colors
  const uniqueBrands = useMemo(() => {
    const brands = carsData.map((car) => car.brand?.split(" ")[0]);
    return Array.from(new Set(brands)).sort();
  }, [carsData]);

  const uniqueColors = useMemo(() => {
    return Array.from(new Set(carsData.map((car) => car.color))).sort();
  }, [carsData]);

  // Filter + Sort Logic
  const filteredAndSortedCars = useMemo(() => {
    let result = carsData.filter((car) => {
      const searchMatch = car.brand
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const brandMatch = filters.brand === "All" || car.brand.includes(filters.brand);
      const fuelMatch = filters.fuel === "All" || car.fuel === filters.fuel;
      const colorMatch = filters.color === "All" || car.color === filters.color;
      const seatsMatch = filters.seats === "All" || car.seats === Number(filters.seats);
      const priceMatch =
        filters.priceRange === "All" ||
        (filters.priceRange === "Low" && car.price < 20000) ||
        (filters.priceRange === "Medium" &&
          car.price >= 20000 &&
          car.price <= 40000) ||
        (filters.priceRange === "High" && car.price > 40000);

      return searchMatch && brandMatch && fuelMatch && colorMatch && priceMatch && seatsMatch;
    });

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    return result;
  }, [carsData, filters, searchQuery, sortBy]);

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "All").length;

  // Loading Screen
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          color: "#ffb300",
          fontSize: "2rem",
        }}
      >
        Loading CarVerse... 🚗
      </div>
    );
  }

  // Login Page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // ===== Main App =====
  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <header>
        <h1>
          🚗Car<span id="Vlogo">V</span>erse
        </h1>
        <p className="tagline">Find your dream car with easy filters & clean view</p>

        {/* User Info + Nav */}
        <div className="user-section">
          <span className="user-greeting">👋 Hi, {user.name}!</span>

          <div className="nav-buttons">
            <button
              className={`nav-btn ${currentPage === "home" ? "active" : ""}`}
              onClick={() => setCurrentPage("home")}
            >
              🏠 Home
            </button>
            <button
              className={`nav-btn ${currentPage === "favorites" ? "active" : ""}`}
              onClick={() => setCurrentPage("favorites")}
            >
              ❤️ Favorites ({favorites.length})
            </button>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* Conditional Rendering */}
      {currentPage === "favorites" ? (
        <Favorites
          favorites={favorites}
          carsData={carsData}
          onToggleFavorite={toggleFavorite}
          onSelectCar={setSelectedCar}
        />
      ) : (
        <>
          <Filters
            filters={filters}
            onChange={handleFilterChange}
            uniqueBrands={uniqueBrands}
            uniqueColors={uniqueColors}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearAllFilters={clearAllFilters}
            activeFiltersCount={activeFiltersCount}
            resultsCount={filteredAndSortedCars.length}
            totalCount={carsData.length}
          />

          <div className="car-list">
            {filteredAndSortedCars.length ? (
              filteredAndSortedCars.map((car) => (
                <div key={car._id || car.id}>
                 <CarCard
  car={car}
  onClick={() => setSelectedCar(car)}
  isFavorite={favorites.includes(car._id || car.id)}
  onToggleFavorite={() => toggleFavorite(car)}
/>

                </div>
              ))
            ) : (
              <div className="no-results">
                <p>😔 No cars found!</p>
                <p>Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </>
      )}

<CarModal car={selectedCar} onClose={() => setSelectedCar(null)} user={user} />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          🚗 CarVerse — Made by{" "}
          <b>Shrinivas Jainapur | Shivanand G C | Vikas Kulkarni</b>
        </p>
        <p>
          📧 <a href="mailto:jainapurshrinivas@gmail.com">jainapurshrinivas@gmail.com</a> |
          📧 <a href="mailto:shivanandchinagepalli49@gmail.com">shivanandchinagepalli49@gmail.com</a> |
          📧 <a href="mailto:vikaskulakarni.pesu@gmail.com">vikaskulakarni.pesu@gmail.com</a> |
          📞 +91-9591489829 | +91-7483283931 | +91-7204390491
        </p>
      </footer>
    </div>
  );
}

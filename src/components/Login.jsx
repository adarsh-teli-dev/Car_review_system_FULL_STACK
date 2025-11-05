import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp && !formData.name) {
      setError("Please enter your name");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (isSignUp) {
      const users = JSON.parse(localStorage.getItem("carverse_users") || "[]");

      if (users.find((u) => u.email === formData.email)) {
        setError("User already exists. Please login.");
        return;
      }

      users.push({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      localStorage.setItem("carverse_users", JSON.stringify(users));

      localStorage.setItem(
        "carverse_current_user",
        JSON.stringify({ email: formData.email, name: formData.name })
      );
      onLogin({ email: formData.email, name: formData.name });
    } else {
      const users = JSON.parse(localStorage.getItem("carverse_users") || "[]");
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        localStorage.setItem(
          "carverse_current_user",
          JSON.stringify({ email: user.email, name: user.name })
        );
        onLogin({ email: user.email, name: user.name });
      } else {
        setError("Invalid email or password");
      }
    }
  };

  const handleDemoLogin = () => {
    const demoUser = { email: "demo@carverse.com", name: "Demo User" };
    localStorage.setItem("carverse_current_user", JSON.stringify(demoUser));
    onLogin(demoUser);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>
            🚗 Car<span style={{ color: "rgb(142, 11, 79)" }}>V</span>erse
          </h1>
          <p>{isSignUp ? "Create your account" : "Welcome back!"}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="form-group">
              <label>👤 Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            {isSignUp ? "Sign Up" : "Login"}
          </button>

          <button type="button" className="demo-btn" onClick={handleDemoLogin}>
            🎮 Try Demo Account
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              className="toggle-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setFormData({ email: "", password: "", name: "" });
              }}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>

        <div className="login-info">
          <p>🔐 Your data is stored locally in your browser</p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.scss";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", productId: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.productId || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    // Replace with your actual auth logic
    if (form.username === "admin" && form.password === "password") {
      navigate("/");
    } else {
      setError("Invalid username, product ID, or password");
    }
  };

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h2 className="login-title">Hydroponics Login</h2>
        {error && <div className="login-error">{error}</div>}

        <label htmlFor="username" className="login-label">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          className="login-input"
          placeholder="Enter your username"
          autoComplete="username"
        />

        <label htmlFor="productId" className="login-label">
          Product ID
        </label>
        <input
          id="productId"
          name="productId"
          type="text"
          value={form.productId}
          onChange={handleChange}
          className="login-input"
          placeholder="Enter your product ID"
        />

        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="login-input"
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <button type="submit" className="login-button">
          Log In
        </button>

        <div className="register-link-container">
          <span>Don't have an account? </span>
          <Link to="/register" className="register-link">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

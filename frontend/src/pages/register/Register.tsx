import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.scss";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    productId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.productId || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          productId: form.productId,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="register-root">
      <form className="register-card" onSubmit={handleSubmit} noValidate>
        <h2 className="register-title">Create Your Account</h2>
        {error && <div className="register-error">{error}</div>}

        <label htmlFor="username" className="register-label">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          className="register-input"
          placeholder="Choose a username"
          autoComplete="username"
        />

        <label htmlFor="productId" className="register-label">Product ID</label>
        <input
          id="productId"
          name="productId"
          type="text"
          value={form.productId}
          onChange={handleChange}
          className="register-input"
          placeholder="Enter your product ID"
        />

        <label htmlFor="password" className="register-label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="register-input"
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="register-input"
          placeholder="Confirm your password"
          autoComplete="new-password"
        />

        <button type="submit" className="register-button">Register</button>

        <div className="login-link-container">
          <span>Already have an account? </span>
          <Link to="/login" className="login-link">Log in here</Link>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.scss";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h2 className="login-title">Hydroponics Login</h2>
        {error && <div className="login-error">{error}</div>}

        <label htmlFor="username" className="login-label">Username</label>
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

        <label htmlFor="password" className="login-label">Password</label>
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

        <button type="submit" className="login-button">Log In</button>

        <div className="register-link-container">
          <span>Don't have an account? </span>
          <Link to="/register" className="register-link">Register here</Link>
        </div>
      </form>
    </div>
  );
}

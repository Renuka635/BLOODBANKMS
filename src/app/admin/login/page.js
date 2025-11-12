"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #e46572ff, #bc9292ff)",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold text-white" href="/">
            🩸 Blood Bank System
          </a>
          <button
            className="btn btn-outline-dangerbtn-lg px-5 py-3 shadow-sm"
            onClick={() => router.push("/")}
          >
            
            ⬅ Back to Home
          </button>
        </div>
      </nav>

      {/* Login Card */}
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <div className="card shadow-lg border-0 p-4" style={{ width: "24rem", borderRadius: "1rem" }}>
          <div className="card-body text-center">
            <h3 className="fw-bold text-danger mb-3">Admin Login</h3>
            <p className="text-muted mb-4">
              Access your dashboard to manage donors, hospitals, and camps.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-outline-danger w-100 fw-semibold"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-3 bg-light">
        <small>
          © {new Date().getFullYear()} Blood Bank System | Admin Panel
        </small>
      </footer>
    </div>
  );
}
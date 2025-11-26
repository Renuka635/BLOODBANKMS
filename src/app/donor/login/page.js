"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

export default function DonorLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/donor/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // redirect with camp details
    router.push(
      `/donor/camp-details?camp=${encodeURIComponent(data.camp)}&location=${encodeURIComponent(
        data.location
      )}&date=${encodeURIComponent(data.date)}`
    );
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #ffccd5 0%, #fff5f5 50%, #ffe6e6 100%)",
      }}
    >
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "100%", maxWidth: "450px" }}>
        <h2 className="text-center text-danger fw-bold mb-3">❤ Donor Login</h2>
        <p className="text-center text-secondary mb-4">
          Login with your registered details to view your blood donation camp.
        </p>

        {error && <div className="alert alert-danger text-center py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-3"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-danger w-100 fw-semibold">
            Login →
          </button>
        </form>

        <p className="text-center text-muted mt-4 fst-italic">
          “Every donor is a hero in someone's story.” 🩸
        </p>
      </div>
    </div>
  );
}
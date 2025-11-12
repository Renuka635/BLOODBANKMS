"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DonorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });
  const [donorData, setDonorData] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/donor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setDonorData(data);
      } else {
        setError("Invalid email or phone. Please try again!");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server. Try again later.");
    }
  };

  if (donorData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(135deg, #ffccd5 0%, #fff5f5 50%, #ffe6e6 100%)",
        }}
      >
        <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center text-danger fw-bold mb-3">
            🩸 Welcome, {donorData.name}!
          </h3>
          <p className="text-center text-secondary mb-3">
            Thank you for your valuable contribution to saving lives ❤
          </p>

          <div className="border rounded-4 p-3 mb-3 bg-light">
            <h5 className="text-danger mb-2 fw-semibold">Donation Details</h5>
            <p className="mb-1">
              <strong>Blood Group:</strong> {donorData.blood_group}
            </p>
            <p className="mb-1">
              <strong>Camp:</strong> {donorData.camp_name || "Not Assigned"}
            </p>
            <p className="mb-1">
              <strong>Location:</strong> {donorData.location || "—"}
            </p>
            <p className="mb-0">
              <strong>Date:</strong>{" "}
              {donorData.date ? new Date(donorData.date).toLocaleDateString() : "—"}
            </p>
          </div>

          <p className="text-center text-muted fst-italic">
            “The blood you donate gives someone another chance at life.” ❤
          </p>

          <button
            className="btn btn-outline-danger w-100 fw-semibold mt-3"
            onClick={() => {
              setDonorData(null);
              setFormData({ email: "", phone: "" });
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #ffccd5 0%, #fff5f5 50%, #ffe6e6 100%)",
      }}
    >
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="text-center text-danger mb-3 fw-bold">🩸 Donor Login</h2>
        <p className="text-center text-secondary mb-4">
          Enter your registered email and phone to check your donation details.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-danger text-center mb-3">{error}</p>}

          <button type="submit" className="btn btn-danger w-100 fw-semibold">
            Login →
          </button>
        </form>

        <p className="text-center text-muted mt-4 fst-italic">
          “Every donor is a hero. Thank you for being one!” ❤
        </p>
      </div>
    </div>
  );
}
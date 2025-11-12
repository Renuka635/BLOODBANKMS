"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DonorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    blood_group: "",
    camp_id: "",
  });
  const [camps, setCamps] = useState([]);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    fetch("/api/admin/camps")
      .then((res) => res.json())
      .then((data) => setCamps(data))
      .catch((err) => console.error("Error fetching camps:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/donor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setRegistered(true);
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    }
  };

  if (registered) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100 text-center"
        style={{
          background: "linear-gradient(135deg, #ffccd5 0%, #fff5f5 50%, #ffe6e6 100%)",
        }}
      >
        <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "450px" }}>
          <h3 className="text-success mb-3 fw-bold">🎉 Successfully Registered!</h3>
          <p className="text-muted">Thank you for registering as a donor.</p>
          <p className="fst-italic text-danger">“You are someone’s type!” ❤</p>
          <button
            className="btn btn-danger mt-3 w-100 fw-semibold"
            onClick={() => (window.location.href = "/donor/login")}
          >
            Login to See Your Activity →
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
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center text-danger mb-3 fw-bold">🩸 Donor Registration</h2>
        <p className="text-center text-secondary mb-4">
          Welcome donor! Please fill your details to join a blood donation camp.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Blood Group</label>
            <select
              className="form-select"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              required
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Select Camp</label>
            <select
              className="form-select"
              name="camp_id"
              value={formData.camp_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose Camp</option>
              {camps.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.camp_name} — {camp.location} ({new Date(camp.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-danger w-100 fw-semibold">
            Register Now →
          </button>
        </form>

        <p className="text-center text-muted mt-4 fst-italic">
          “Every drop you donate counts — be the reason for someone’s heartbeat.” ❤
        </p>
      </div>
    </div>
  );
}
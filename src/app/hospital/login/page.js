"use client";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HospitalLogin() {
  const [form, setForm] = useState({ email: "", hospital_id: "" });
  const [message, setMessage] = useState("");
  const [hospitalData, setHospitalData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/hospital/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setHospitalData(data.hospital);
        setMessage("✅ Login successful!");
      } else {
        setMessage(data.error || "❌ Invalid credentials");
      }
    } catch {
      setMessage("⚠ Something went wrong.");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
      style={{ background: "linear-gradient(to bottom, #ffe6e6, #ffffff)" }}
    >
      {!hospitalData ? (
        <div className="card shadow-lg p-4 border-0" style={{ width: "24rem" }}>
          <h2 className="text-center text-danger fw-bold mb-3">
            🏥 Hospital Login
          </h2>
          <p className="text-muted text-center mb-4">
            Enter your credentials to manage blood requests and payments.
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Hospital ID</label>
              <input
                type="text"
                className="form-control"
                required
                value={form.hospital_id}
                onChange={(e) => setForm({ ...form, hospital_id: e.target.value })}
              />
            </div>
            <button className="btn btn-danger w-100 fw-semibold">Login</button>
          </form>
          {message && <p className="text-center mt-3 fw-semibold">{message}</p>}
        </div>
      ) : (
        <div className="card shadow-lg p-4 border-0" style={{ width: "30rem" }}>
          <h3 className="text-center text-danger fw-bold mb-3">
            Welcome, {hospitalData.hospital_name}
          </h3>
          <p className="text-center text-muted mb-3">
            Blood Request Details
          </p>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Requested Blood:</strong> {hospitalData.requested_blood || "A+"}
            </li>
            <li className="list-group-item">
              <strong>Address:</strong> {hospitalData.address}
            </li>
            <li className="list-group-item">
              <strong>Contact:</strong> {hospitalData.contact_number}
            </li>
            <p>
  Billing Status:{" "}
  <span
    className={
      hospital.billing_status === "success"
        ? "text-success fw-bold"
        : "text-warning fw-bold"
    }
  >
    {hospital.billing_status}
  </span>
</p>
          </ul>
        </div>
      )}
    </div>
  );
}
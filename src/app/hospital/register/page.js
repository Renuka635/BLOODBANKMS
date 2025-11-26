"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HospitalRegister() {
  const router = useRouter();

  const [bloodOptions, setBloodOptions] = useState([]);
  const [form, setForm] = useState({
    hospital_name: "",
    email: "",
    hospital_id: "",
    address: "",
    contact_number: "",
    blood_stock: "",
    requested_units: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch("/api/bloodstock");
        const data = await res.json();
        setBloodOptions(data);
      } catch (err) {
        console.log("Error fetching stock", err);
      }
    }
    fetchStock();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/hospital/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("✅ Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/hospital/login"), 2000);
      } else {
        const data = await res.json();
        setMessage(data.error || "❌ Registration failed.");
      }
    } catch {
      setMessage("⚠ Network error occurred.");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
      style={{ background: "linear-gradient(to bottom, #ffe6e6, #ffffff)" }}
    >
      <div className="card shadow-lg p-4 border-0" style={{ width: "28rem" }}>
        <h2 className="text-center text-danger fw-bold mb-3">
          🏥 Hospital Registration
        </h2>

        <form onSubmit={handleSubmit}>
          {[
            ["hospital_name", "Hospital Name"],
            ["email", "Email"],
            ["hospital_id", "Hospital ID"],
            ["address", "Address"],
            ["contact_number", "Contact Number"],
          ].map(([key, label]) => (
            <div className="mb-3" key={key}>
              <label className="form-label">{label}</label>
              <input
                type="text"
                className="form-control"
                required
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            </div>
          ))}

          {/* Blood stock dropdown */}
          <div className="mb-3">
            <label className="form-label">Available Blood Stock</label>

            <select
              className="form-select"
              required
              value={form.blood_stock}
              onChange={(e) =>
                setForm({ ...form, blood_stock: e.target.value })
              }
            >
              <option value="">Select Available Stock</option>

              {bloodOptions.map((item, i) => (
                <option
                  key={i}
                  value={`${item.blood_group} : ${item.quantity} quantity`}
                >
                  {item.blood_group} — {item.quantity} quantity
                </option>
              ))}
            </select>
          </div>

          {/* Requested units */}
          <div className="mb-3">
            <label className="form-label">Blood Units Required</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="E.g. B+ : 3 units"
              value={form.requested_units}
              onChange={(e) =>
                setForm({
                  ...form,
                  requested_units: e.target.value,
                })
              }
            />
          </div>

          <button className="btn btn-danger w-100 fw-semibold">
            Register
          </button>
        </form>

        {/* 🔽 Added Login Button Below – No other content changed */}
        <button
          className="btn btn-outline-secondary w-100 mt-3 fw-semibold"
          onClick={() => router.push("/hospital/login")}
        >
          Already Registered? Login
        </button>

        {message && <p className="text-center mt-3 fw-semibold">{message}</p>}
      </div>
    </div>
  );
}
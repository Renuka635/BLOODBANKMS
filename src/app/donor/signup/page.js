"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DonorSignup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", blood_group: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/donor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setMsg("Registered Successfully!");
      setTimeout(() => router.push("/donor/dashboard"), 1000);
    } else setMsg("Error: " + data.error);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-danger text-center fw-bold mb-3">Donor Registration</h2>
      <div className="alert alert-info">
        <b>Instructions:</b> You must be 18–60 years old, weigh over 50kg, and be healthy.
      </div>

      <form className="shadow p-4 rounded bg-light" onSubmit={handleSubmit}>
        {["name", "email", "phone", "blood_group"].map((field) => (
          <input
            key={field}
            type="text"
            className="form-control mb-3"
            placeholder={field.replace("_", " ").toUpperCase()}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            required
          />
        ))}
        <button className="btn btn-danger w-100 fw-semibold" type="submit">
          Register
        </button>
        {msg && <div className="alert alert-success mt-3">{msg}</div>}
      </form>
    </div>
  );
}
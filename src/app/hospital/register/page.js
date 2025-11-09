"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HospitalRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    hospital_name: "",
    email: "",
    hospital_id: "",
    address: "",
    contact_number: "",
  });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/hospital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setMsg("Hospital Registered Successfully!");
      setTimeout(() => router.push("/hospital/dashboard"), 1000);
    } else setMsg("Error: " + data.error);
  };

  return (
    <div className="container mt-5">
      <h3 className="text-danger text-center fw-bold mb-3">Hospital Registration</h3>
      <form className="shadow p-4 bg-light rounded" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type="text"
            className="form-control mb-3"
            placeholder={key.replace("_", " ").toUpperCase()}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
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
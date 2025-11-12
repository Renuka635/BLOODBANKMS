"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DonorEligibility() {
  const [answers, setAnswers] = useState({
    age: "",
    weight: "",
    health: "",
    meal: "",
    drugs: "",
  });

  const handleChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const allYes = Object.values(answers).every((v) => v === "Yes");
    if (allYes) {
      window.location.href = "/donor/register";
    } else {
      alert("❌ You are not eligible to donate blood at this time.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #ffccd5 0%, #fff5f5 50%, #ffe6e6 100%)",
      }}
    >
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center text-danger mb-3 fw-bold">❤ Donor Eligibility Check</h2>
        <p className="text-center text-secondary mb-4">
          Welcome donor! Please answer these quick questions before registering.
        </p>

        {[
          { field: "age", question: "Are you between 18 and 65 years old?" },
          { field: "weight", question: "Do you weigh more than 50 kg?" },
          { field: "health", question: "Are you feeling healthy today?" },
          { field: "meal", question: "Have you eaten a healthy meal recently?" },
          { field: "drugs", question: "Have you avoided any drugs or alcohol recently?" },
        ].map((q, i) => (
          <div key={i} className="d-flex justify-content-between align-items-center mb-3 bg-light rounded-3 px-3 py-2">
            <span className="fw-semibold text-dark">{q.question}</span>
            <div>
              <button
                className={`btn btn-sm me-2 ${
                  answers[q.field] === "Yes" ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => handleChange(q.field, "Yes")}
              >
                Yes
              </button>
              <button
                className={`btn btn-sm ${
                  answers[q.field] === "No" ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => handleChange(q.field, "No")}
              >
                No
              </button>
            </div>
          </div>
        ))}

        <div className="text-center mt-4">
          <button onClick={handleSubmit} className="btn btn-danger w-100 fw-semibold">
            Proceed to Registration →
          </button>
        </div>

        <p className="text-center text-muted mt-4 fst-italic">
          “You don’t have to be a doctor to save lives — just donate blood.” 🩸
        </p>
      </div>
    </div>
  );
}
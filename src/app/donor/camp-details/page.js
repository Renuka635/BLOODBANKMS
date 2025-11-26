"use client";

import { useSearchParams } from "next/navigation";

export default function DonorCampDetails() {
  const params = useSearchParams();

  const camp = params.get("camp");
  const location = params.get("location");
  const date = params.get("date");

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg, #ffccd5 0%, #fff5f5 50%, #ffe6e6 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center text-danger mb-3 fw-bold">
          🏥 Your Blood Donation Camp
        </h2>

        <div className="mb-3">
          <strong>Camp Name:</strong> {camp}
        </div>
        <div className="mb-3">
          <strong>Location:</strong> {location}
        </div>
        <div className="mb-3">
          <strong>Date:</strong> {date}
        </div>

        <p className="text-center mt-4 text-secondary">
          Thank you for choosing to save lives! ❤️🩸
        </p>
      </div>
    </div>
  );
}
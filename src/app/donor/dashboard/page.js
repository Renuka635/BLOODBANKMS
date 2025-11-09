"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DonorDashboard() {
  const [camps, setCamps] = useState([]);
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({
    donor_id: "",
    camp_id: "",
    donation_date: "",
  });

  useEffect(() => {
    fetchCamps();
    fetchDonations();
  }, []);

  async function fetchCamps() {
    const res = await fetch("/api/donor/camps");
    setCamps(await res.json());
  }

  async function fetchDonations() {
    const res = await fetch("/api/donor/donation");
    setDonations(await res.json());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/donor/donation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Donation recorded successfully!");
    setForm({ donor_id: "", camp_id: "", donation_date: "" });
    fetchDonations();
  }

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger fw-bold mb-5">
        🩸 Donor Dashboard
      </h2>

      {/* AVAILABLE CAMPS */}
      <div className="card shadow mb-5">
        <div className="card-header bg-danger text-white fw-semibold">
          Upcoming Blood Donation Camps
        </div>
        <div className="card-body table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Camp Name</th>
                <th>Location</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {camps.length > 0 ? (
                camps.map((camp) => (
                  <tr key={camp.id}>
                    <td>{camp.id}</td>
                    <td>{camp.camp_name}</td>
                    <td>{camp.location}</td>
                    <td>{new Date(camp.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No upcoming camps available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER DONATION */}
      <div className="card shadow mb-5">
        <div className="card-header bg-danger text-white fw-semibold">
          Register Your Donation
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Donor ID"
                  className="form-control"
                  value={form.donor_id}
                  onChange={(e) =>
                    setForm({ ...form, donor_id: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={form.camp_id}
                  onChange={(e) =>
                    setForm({ ...form, camp_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Camp</option>
                  {camps.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.camp_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  value={form.donation_date}
                  onChange={(e) =>
                    setForm({ ...form, donation_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <button
                  type="submit"
                  className="btn btn-danger w-100 fw-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* DONATION HISTORY */}
      <div className="card shadow mb-5">
        <div className="card-header bg-danger text-white fw-semibold">
          Donation History
        </div>
        <div className="card-body table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Donor Name</th>
                <th>Camp Name</th>
                <th>Location</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.donor_name}</td>
                    <td>{d.camp_name}</td>
                    <td>{d.location}</td>
                    <td>{new Date(d.donation_date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No donation records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOGOUT */}
      <div className="text-center">
        <button
          className="btn btn-outline-danger fw-semibold"
          onClick={() => (window.location.href = "/")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
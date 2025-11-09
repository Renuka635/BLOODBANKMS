"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HospitalDashboard() {
  const [stock, setStock] = useState([]);
  const [billing, setBilling] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    hospital_id: "",
    blood_group: "",
    quantity: "",
  });

  useEffect(() => {
    fetchStock();
    fetchBilling();
  }, []);

  async function fetchStock() {
    const res = await fetch(`/api/hospital/stock?group=${search}`);
    setStock(await res.json());
  }

  async function fetchBilling() {
    const res = await fetch("/api/hospital/billing");
    setBilling(await res.json());
  }

  async function handleBilling(e) {
    e.preventDefault();

    await fetch("/api/hospital/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Billing record created!");
    setForm({ hospital_id: "", blood_group: "", quantity: "" });
    fetchBilling();
  }

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger fw-bold mb-5">
        🏥 Hospital Dashboard
      </h2>

      {/* BLOOD STOCK */}
      <div className="card shadow mb-5">
        <div className="card-header bg-danger text-white fw-semibold">
          Blood Stock Availability
        </div>
        <div className="card-body">
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by blood group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-danger" onClick={fetchStock}>
              Search
            </button>
          </div>

          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Blood Group</th>
                <th>Quantity (Units)</th>
              </tr>
            </thead>
            <tbody>
              {stock.length > 0 ? (
                stock.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.blood_group}</td>
                    <td>{s.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BILLING FORM */}
      <div className="card shadow mb-5">
        <div className="card-header bg-danger text-white fw-semibold">
          Generate Billing
        </div>
        <div className="card-body">
          <form onSubmit={handleBilling}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Hospital ID"
                  className="form-control"
                  value={form.hospital_id}
                  onChange={(e) =>
                    setForm({ ...form, hospital_id: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="Blood Group"
                  className="form-control"
                  value={form.blood_group}
                  onChange={(e) =>
                    setForm({ ...form, blood_group: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Quantity"
                  className="form-control"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <button
                  type="submit"
                  className="btn btn-danger w-100 fw-semibold"
                >
                  Generate Bill
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* BILLING HISTORY */}
      <div className="card shadow mb-5">
        <div className="card-header bg-danger text-white fw-semibold">
          Billing History
        </div>
        <div className="card-body table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Hospital</th>
                <th>Blood Group</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {billing.length > 0 ? (
                billing.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.hospital_name}</td>
                    <td>{b.blood_group}</td>
                    <td>{b.quantity}</td>
                    <td>₹{b.total_amount}</td>
                    <td>{new Date(b.billing_date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No billing records yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
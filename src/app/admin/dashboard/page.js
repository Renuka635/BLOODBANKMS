"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Admin Dashboard (merged Add Camp into Camp List)
 * Minimal changes — only fixes requested fields and stock update behaviour.
 */

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("campList"); // default to merged section
  const [loading, setLoading] = useState(false);

  // Forms / state
  const [campForm, setCampForm] = useState({
    camp_name: "",
    location: "",
    date: "",
    staff_name: "",
    qualification: "",
    staff_phone: "",
    staff_email: "",
  });

  const [staffForm, setStaffForm] = useState({
    name: "",
    qualification: "",
    phone: "",
    email: "",
  });

  const [stockForm, setStockForm] = useState({ blood_group: "", units: "" });

  const [billingForm, setBillingForm] = useState({
    hospital_id: "",
    hospital_name: "",
    date_of_supply: "",
    pending_amount: "",
    paid_amount: "",
  });

  // Lists
  const [staffList, setStaffList] = useState([]);
  const [campList, setCampList] = useState([]);
  const [donorList, setDonorList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [stockList, setStockList] = useState([]);

  // Load initial data
  useEffect(() => {
    refreshAll();
  }, []);

  async function refreshAll() {
    setLoading(true);
    await Promise.all([
      fetchStaff(),
      fetchCamps(),
      fetchDonors(),
      fetchHospitals(),
      fetchStock(),
    ]);
    setLoading(false);
  }

  // Fetch helpers (safe parsing)
  const safeFetch = async (url, opts = {}) => {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Fetch error", url, res.status, txt);
        return null;
      }
      const json = await res.json().catch(() => null);
      return json;
    } catch (err) {
      console.error("Fetch exception", url, err);
      return null;
    }
  };

  async function fetchStaff() {
    const data = await safeFetch("/api/admin/staff");
    setStaffList(Array.isArray(data) ? data : []);
  }
  async function fetchCamps() {
    const data = await safeFetch("/api/admin/camps");
    setCampList(Array.isArray(data) ? data : []);
  }
  async function fetchDonors() {
    const data = await safeFetch("/api/admin/donors");
    setDonorList(Array.isArray(data) ? data : []);
  }
  async function fetchHospitals() {
    const data = await safeFetch("/api/admin/hospitals");
    setHospitalList(Array.isArray(data) ? data : []);
  }
  async function fetchStock() {
    const data = await safeFetch("/api/admin/stock");
    setStockList(Array.isArray(data) ? data : []);
  }

  // Handlers
  async function handleAddCamp(e) {
    e.preventDefault();
    const payload = {
      camp_name: campForm.camp_name,
      location: campForm.location,
      date: campForm.date,
      staff: {
        name: campForm.staff_name,
        qualification: campForm.qualification,
        phone: campForm.staff_phone,
        email: campForm.staff_email,
      },
    };
    const res = await safeFetch("/api/admin/camps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res) {
      alert("Camp added successfully");
      setCampForm({
        camp_name: "",
        location: "",
        date: "",
        staff_name: "",
        qualification: "",
        staff_phone: "",
        staff_email: "",
      });
      await fetchCamps();
      await fetchStaff();
    } else {
      alert("Failed to add camp");
    }
  }

  async function handleAddStaff(e) {
    e.preventDefault();
    const payload = { ...staffForm };
    const res = await safeFetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res) {
      alert("Staff added");
      setStaffForm({ name: "", qualification: "", phone: "", email: "" });
      await fetchStaff();
    } else {
      alert("Failed to add staff");
    }
  }

  async function handleStockUpdate(e) {
    e.preventDefault();
    const payload = {
      blood_group: stockForm.blood_group,
      units: Number(stockForm.units) || 0,
    };

    // call backend to update (expecting PUT /api/admin/stock handling)
    const res = await safeFetch("/api/admin/stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res) {
      // Update frontend state immediately:
      setStockList((prev) => {
        const idx = prev.findIndex((p) => (p.blood_group || "").toString() === (payload.blood_group || "").toString());
        if (idx >= 0) {
          // replace item
          const copy = [...prev];
          copy[idx] = { ...copy[idx], units: payload.units };
          return copy;
        } else {
          // add new entry
          return [...prev, { blood_group: payload.blood_group, units: payload.units }];
        }
      });

      alert("Stock updated");
      setStockForm({ blood_group: "", units: "" });
    } else {
      alert("Failed to update stock");
    }
  }

  async function handleBillingSubmit(e) {
    e.preventDefault();
    const payload = { ...billingForm };
    const res = await safeFetch("/api/admin/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res) {
      alert("Billing recorded");
      setBillingForm({
        hospital_id: "",
        hospital_name: "",
        date_of_supply: "",
        pending_amount: "",
        paid_amount: "",
      });
      await fetchHospitals();
    } else {
      alert("Failed to add billing");
    }
  }

  const computeStockStatus = (units) => {
    const u = Number(units) || 0;
    if (u <= 3) return "Low";
    if (u <= 8) return "Medium";
    return "High";
  };

  // UI
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #fff5f5, #ffe6e6)" }}>
      <div className="d-flex">
        {/* Sidebar */}
        <aside style={{ width: 260 }} className="bg-danger text-white vh-100 p-3">
          <div className="mb-4 text-center">
            <h5 className="mb-0 fw-bold">🩸 Admin Panel</h5>
            <small className="text-white-50">Control Center</small>
          </div>

          {[
            /* merged: only Camp List now */
            { key: "campList", label: "Camp List" },
            { key: "staff", label: "Staff List" },
            { key: "donors", label: "Registered Donors" },
            { key: "hospitals", label: "Hospital List" },
            { key: "billing", label: "Billing" },
            { key: "stock", label: "Blood Stock" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveSection(btn.key)}
              className={`btn w-100 text-start mb-2 ${activeSection === btn.key ? "btn-light text-danger" : "btn-outline-light text-white"}`}
            >
              {btn.label}
            </button>
          ))}

          <div className="mt-4 small text-white-50">
            <div>Tip: Click a section to manage</div>
            <div className="mt-2">Last refresh: {loading ? "loading..." : "live"}</div>
            <button className="btn btn-sm btn-light mt-3" onClick={refreshAll}>Refresh All</button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-grow-1 p-4">
          {loading && <div className="mb-3 alert alert-info">Refreshing data...</div>}

          {/* Camp List (merged: add form on top + list below) */}
          {activeSection === "campList" && (
            <section>
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-danger text-white fw-bold">📋 Camp List</div>
                <div className="card-body">
                  {/* Add Camp Form (merged) */}
                  <form onSubmit={handleAddCamp} className="row g-3 mb-4">
                    <div className="col-md-4">
                      <input className="form-control" placeholder="Camp Name"
                        value={campForm.camp_name || ""}
                        onChange={(e) => setCampForm({ ...campForm, camp_name: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <input className="form-control" placeholder="Location"
                        value={campForm.location || ""}
                        onChange={(e) => setCampForm({ ...campForm, location: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <input type="date" className="form-control"
                        value={campForm.date || ""}
                        onChange={(e) => setCampForm({ ...campForm, date: e.target.value })} required />
                    </div>

                    {/* Staff quick add inside Add Camp */}
                    <div className="col-md-4">
                      <input className="form-control" placeholder="Staff Name"
                        value={campForm.staff_name || ""}
                        onChange={(e) => setCampForm({ ...campForm, staff_name: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input className="form-control" placeholder="Qualification"
                        value={campForm.qualification || ""}
                        onChange={(e) => setCampForm({ ...campForm, qualification: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <input className="form-control" placeholder="Phone"
                        value={campForm.staff_phone || ""}
                        onChange={(e) => setCampForm({ ...campForm, staff_phone: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input className="form-control" placeholder="Email"
                        value={campForm.staff_email || ""}
                        onChange={(e) => setCampForm({ ...campForm, staff_email: e.target.value })} />
                    </div>

                    <div className="col-12 text-end">
                      <button className="btn btn-danger">Add Camp</button>
                    </div>
                  </form>

                  {/* Staff visibility: show staff list for easy assignment */}
                  <div className="mt-2 mb-3">
                    <h6>Existing Staff (click to copy name to staff field)</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {staffList.length > 0 ? staffList.map((s) => (
                        <button key={s.id}
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setCampForm(form => ({ ...form, staff_name: s.name || s.staff_name || "", qualification: s.qualification || s.qual || "", staff_phone: s.phone || s.contact || "", staff_email: s.email || s.staff_email || "" }))}>
                          {s.name || s.staff_name || "Unnamed"}
                        </button>
                      )) : <div className="text-muted">No staff yet</div>}
                    </div>
                  </div>

                  {/* Camp table */}
                  <div className="table-responsive">
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
                        {campList.length > 0 ? campList.map(c => (
                          <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.camp_name || c.name || "-"}</td>
                            <td>{c.location || "-"}</td>
                            <td>{c.date ? new Date(c.date).toLocaleDateString() : (c.camp_date ? new Date(c.camp_date).toLocaleDateString() : "-")}</td>
                            
                          </tr>
                        )) : <tr><td colSpan="5" className="text-center">No camps</td></tr>}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </section>
          )}

          {/* Staff */}
          {activeSection === "staff" && (
            <section>
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-danger text-white fw-bold">👥 Staff List</div>
                <div className="card-body">
                  <form onSubmit={handleAddStaff} className="row g-3 mb-4">
                    <div className="col-md-3">
                      <input className="form-control" placeholder="Name"
                        value={staffForm.name || ""}
                        onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <input className="form-control" placeholder="Qualification"
                        value={staffForm.qualification || ""}
                        onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <input className="form-control" placeholder="Phone"
                        value={staffForm.phone || ""}
                        onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} required />
                    </div>
                    <div className="col-md-3 d-grid">
                      <button className="btn btn-danger">Add Staff</button>
                    </div>
                  </form>

                  <div className="table-responsive">
                    <table className="table table-striped align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                         
                          <th>Phone</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {staffList.length > 0 ? staffList.map(s => (
                          <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name || s.staff_name || "-"}</td>
                            
                            <td>{s.phone || s.contact || "-"}</td>
                          
                          </tr>
                        )) : <tr><td colSpan="5" className="text-center">No staff found</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Donors */}
          {activeSection === "donors" && (
            <section>
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-danger text-white fw-bold">🩸 Registered Donors</div>
                <div className="card-body table-responsive">
                  <table className="table table-striped align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Blood Group</th>
                       
                        <th>Contact</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {donorList.length > 0 ? donorList.map(d => (
                        <tr key={d.id}>
                          <td>{d.id}</td>
                          <td>{d.name || d.full_name || "-"}</td>
                          <td>{d.blood_group || d.bgrp || "-"}</td>
                         
                          <td>{d.contact || d.phone || d.contact_no || "-"}</td>
                          
                        </tr>
                      )) : <tr><td colSpan="6" className="text-center">No donors</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Hospitals */}
          {activeSection === "hospitals" && (
            <section>
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-danger text-white fw-bold">🏥 Hospital List</div>
                <div className="card-body table-responsive">
                  <table className="table table-striped align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Requested Group</th>
                        <th>Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hospitalList.length > 0 ? hospitalList.map(h => (
                        <tr key={h.id}>
                          <td>{h.id}</td>
                          <td>{h.hospital_name || h.name || "-"}</td>
                          <td>{h.address || h.hospital_address || "-"}</td>
                          <td>{h.contact_number || h.phone || "-"}</td>
                          <td>{h.blood_stock || h.request_group || h.requested_blood || "-"}</td>
                          <td>{h.requested_units ?? h.units ?? "-"}</td>
                        </tr>
                      )) : <tr><td colSpan="6" className="text-center">No hospitals</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Billing */}
          {activeSection === "billing" && (
            <section>
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-danger text-white fw-bold">💳 Hospital Billing</div>
                <div className="card-body">
                  <form onSubmit={handleBillingSubmit} className="row g-3 mb-4">
                    <div className="col-md-4">
                      <input className="form-control" placeholder="Hospital ID"
                        value={billingForm.hospital_id || ""}
                        onChange={(e) => setBillingForm({ ...billingForm, hospital_id: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <input className="form-control" placeholder="Hospital Name"
                        value={billingForm.hospital_name || ""}
                        onChange={(e) => setBillingForm({ ...billingForm, hospital_name: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                      <input type="date" className="form-control"
                      value={billingForm.date_of_supply || ""}
                        onChange={(e) => setBillingForm({ ...billingForm, date_of_supply: e.target.value })} required />
                    </div>
                    <div className="col-md-2 d-grid">
                      <button className="btn btn-danger">Add Billing</button>
                    </div>
                  </form>

                  <div className="table-responsive">
                    <table className="table table-striped align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Hospital</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {hospitalList.length > 0 ? hospitalList.map(h => (
                          <tr key={h.id}>
                            <td>{h.id}</td>
                            <td>{h.hospital_name || "-"}</td>
                           
                          </tr>
                        )) : <tr><td colSpan="5" className="text-center">No billing records</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Stock Section */}
          {activeSection === "stock" && (
            <section>
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-danger text-white fw-bold">📊 Blood Stock</div>
                <div className="card-body">

                  {/* Update Stock Form */}
                  <form onSubmit={handleStockUpdate} className="row g-3 mb-4">
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={stockForm.blood_group || ""}
                        onChange={(e) => setStockForm({ ...stockForm, blood_group: e.target.value })}
                        required
                      >
                        <option value="">Select Blood Group</option>
                        {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Units"
                        value={stockForm.units ?? ""}
                        onChange={(e) => setStockForm({ ...stockForm, units: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4 d-grid">
                      <button className="btn btn-danger">Update Stock</button>
                    </div>
                  </form>

                  {/* Stock Table */}
                  <div className="table-responsive">
                    <table className="table table-striped align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>Blood Group</th>
                          <th>Units</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockList.length > 0 ? stockList.map(s => (
                          <tr key={s.blood_group || s.id || Math.random()}>
                            <td>{s.blood_group || s.group || "-"}</td>
                            <td>{(s.units ?? s.quantity ?? 0).toString()}</td>
                            <td>
                              <span className={
                                computeStockStatus(s.units ?? s.quantity ?? 0) === "Low" ? "text-danger fw-bold" :
                                computeStockStatus(s.units ?? s.quantity ?? 0) === "Medium" ? "text-warning fw-bold" :
                                "text-success fw-bold"
                              }>
                                {computeStockStatus(s.units ?? s.quantity ?? 0)}
                              </span>
                            </td>
                          </tr>
                        )) : <tr><td colSpan="3" className="text-center">No stock data</td></tr>}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
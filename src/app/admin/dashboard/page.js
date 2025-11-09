"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminDashboard() {
  const [camps, setCamps] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [campForm, setCampForm] = useState({ camp_name: "", location: "", date: "" });
  const [staffForm, setStaffForm] = useState({ name: "", role: "", phone: "", email: "" });
  const [assignForm, setAssignForm] = useState({ camp_id: "", staff_id: "", assigned_date: "" });
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [stock, setStock] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");



  useEffect(() => {
    fetchCamps();
    fetchStaff();
    fetchAssignments();
    fetchData();
  }, []);

  // ✅ Utility fetch handler
  const safeFetchJSON = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  async function fetchCamps() {
    const data = await safeFetchJSON("/api/admin/camps");
    setCamps(data);
  }

  async function fetchStaff() {
    const data = await safeFetchJSON("/api/admin/staff");
    setStaff(data);
  }

  async function fetchAssignments() {
    const data = await safeFetchJSON("/api/admin/assign");
    setAssignments(data);
  }

  async function handleAddCamp(e) {
    e.preventDefault();
    await fetch("/api/admin/camps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campForm),
    });
    alert("✅ Camp added successfully!");
    setCampForm({ camp_name: "", location: "", date: "" });
    fetchCamps();
  }

  async function handleAddStaff(e) {
    e.preventDefault();
    await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffForm),
    });
    alert("✅ Staff added successfully!");
    setStaffForm({ name: "", role: "", phone: "", email: "" });
    fetchStaff();
  }

  async function handleAssign(e) {
    e.preventDefault();
    await fetch("/api/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignForm),
    });
    alert("✅ Staff assigned successfully!");
    setAssignForm({ camp_id: "", staff_id: "", assigned_date: "" });
    fetchAssignments();
  }
  async function fetchData() {
    const donorRes = await fetch("/api/admin/donors");
    setDonors(await donorRes.json());

    const hospitalRes = await fetch("/api/admin/hospitals");
    setHospitals(await hospitalRes.json());

    const stockRes = await fetch("/api/admin/stock");
    setStock(await stockRes.json());
  }

  async function handleUpdate(id) {
    await fetch("/api/admin/stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: newQuantity }),
    });
    setEditMode(null);
    fetchData();
  }


  return (
    <div className="container py-5"> {/* Main container start */}
      <h2 className="text-center text-danger fw-bold mb-5">
        🩸 Blood Bank Admin Dashboard
      </h2>

      {/* Add Camp Section */}
      <div className="card shadow mb-5 border-0">
        <div className="card-header bg-danger text-white fw-semibold">
          ➕ Add Blood Donation Camp
        </div>
        <div className="card-body">
          <form onSubmit={handleAddCamp} className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                placeholder="Camp Name"
                className="form-control"
                value={campForm.camp_name}
                onChange={(e) => setCampForm({ ...campForm, camp_name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                placeholder="Location"
                className="form-control"
                value={campForm.location}
                onChange={(e) => setCampForm({ ...campForm, location: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={campForm.date}
                onChange={(e) => setCampForm({ ...campForm, date: e.target.value })}
                required
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-danger w-100">Add</button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Staff Section */}
      <div className="card shadow mb-5 border-0">
        <div className="card-header bg-danger text-white fw-semibold">👩‍⚕ Add Staff</div>
        <div className="card-body">
          <form onSubmit={handleAddStaff} className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                placeholder="Role"
                className="form-control"
                value={staffForm.role}
                onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                placeholder="Phone"
                className="form-control"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-danger w-100">Add</button>
            </div>
          </form>
        </div>
      </div>

      {/* Assign Staff to Camp */}
      <div className="card shadow mb-5 border-0">
        <div className="card-header bg-danger text-white fw-semibold">
          🔗 Assign Staff to Camp
        </div>
        <div className="card-body">
          <form onSubmit={handleAssign} className="row g-3">
            <div className="col-md-4">
              <select
                className="form-select"
                value={assignForm.camp_id}
                onChange={(e) => setAssignForm({ ...assignForm, camp_id: e.target.value })}
                required
              >
                <option value="">Select Camp</option>
                {camps.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.camp_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={assignForm.staff_id}
                onChange={(e) => setAssignForm({ ...assignForm, staff_id: e.target.value })}
                required
              >
                <option value="">Select Staff</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={assignForm.assigned_date}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, assigned_date: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-danger w-100">Assign</button>
            </div>
          </form>
        </div>
      </div>

      {/* Assigned Staff Table */}
      <div className="card shadow border-0 mb-5"> {/* Added mb-5 for spacing */}
        <div className="card-header bg-danger text-white fw-semibold">
          📋 Assigned Staff Overview
        </div>
        <div className="card-body table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Camp</th>
                <th>Staff</th>
                <th>Role</th>
                <th>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.camp_name || "N/A"}</td>
                    <td>{a.staff_name || "N/A"}</td>
                    <td>{a.role || "N/A"}</td>
                    <td>
                      {a.assigned_date
                        ? new Date(a.assigned_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No staff assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    {/* Removed the closing div here to include the remaining sections */}

    {/* BLOOD STOCK */}
      <div className="card shadow mb-5">
        <div className="card-header bg-danger text-white fw-semibold">
          Blood Stock Management
        </div>
        <div className="card-body table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Blood Group</th>
                <th>Quantity (Units)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.blood_group}</td>
                  <td>
                    {editMode === item.id ? (
                      <input
                        type="number"
                        className="form-control"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td>
                    {editMode === item.id ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleUpdate(item.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          setEditMode(item.id);
                          setNewQuantity(item.quantity);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DONORS */}
      <div className="card shadow mb-5">
        <div className="card-header bg-danger text-white fw-semibold">
          Registered Donors
        </div>
        <div className="card-body table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Blood Group</th>
              </tr>
            </thead>
            <tbody>
              {donors.length > 0 ? (
                donors.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td>{d.phone}</td>
                    <td>{d.blood_group}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No donors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div> // Main container end
  );
}
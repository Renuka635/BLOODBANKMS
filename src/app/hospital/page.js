"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

export default function HospitalRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    hospital_name: "",
    email: "",
    hospital_code: "",
    address: "",
    contact: "",
  });
  const [reqForm, setReqForm] = useState({ blood_group: "A+", units: 1, price_per_unit: 1500 });
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/hospital", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registered successfully. Please login to manage requests.");
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  // submit a quick request after registration (optional) — requires hospital id
  const handleQuickRequest = async (e) => {
    e.preventDefault();
    // ask hospital to login first to get hospital_id
    const hospital_id = localStorage.getItem("hospital_id");
    if (!hospital_id) {
      return setMessage("Please login first to submit requests.");
    }
    try {
      const res = await fetch("/api/hospital/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospital_id, ...reqForm }),
      });
      const data = await res.json();
      if (res.ok) setMessage("✅ Request submitted");
      else setMessage(data.error || "Request failed");
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ background: "linear-gradient(to bottom, #fff5f5, #ffffff)", minHeight: "100vh", padding: 30 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body p-4">
            <h2 className="text-danger fw-bold">Welcome Hospital</h2>
            <p className="text-muted">Register your hospital to request blood units and manage billing.</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-danger text-white">Hospital Registration</div>
              <div className="card-body">
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label">Hospital Name</label>
                    <input className="form-control" value={form.hospital_name} onChange={(e)=>setForm({...form,hospital_name:e.target.value})} required/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Hospital ID (pick a code)</label>
                    <input className="form-control" value={form.hospital_code} onChange={(e)=>setForm({...form,hospital_code:e.target.value})} required/>
                    <small className="form-text text-muted">You will use this with email to login.</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea className="form-control" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input className="form-control" value={form.contact} onChange={(e)=>setForm({...form,contact:e.target.value})}/>
                  </div>
                  <button className="btn btn-danger w-100" type="submit">Register Hospital</button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}
                <div className="mt-3 text-center">
                  <button className="btn btn-outline-danger" onClick={()=>router.push("/hospital/login")}>Go to Login</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-danger text-white">Quick Request (after login)</div>
              <div className="card-body">
                <form onSubmit={handleQuickRequest}>
                  <div className="mb-3">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" value={reqForm.blood_group} onChange={(e)=>setReqForm({...reqForm,blood_group:e.target.value})}>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Units</label>
                    <input type="number" min="1" className="form-control" value={reqForm.units} onChange={(e)=>setReqForm({...reqForm,units:Number(e.target.value)})}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price/Unit (₹)</label>
                    <input type="number" className="form-control" value={reqForm.price_per_unit} onChange={(e)=>setReqForm({...reqForm,price_per_unit:Number(e.target.value)})}/>
                  </div>
                  <button className="btn btn-danger w-100" type="submit">Request Blood</button>
                </form>
                <small className="text-muted">Note: login first to connect request with your hospital account.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
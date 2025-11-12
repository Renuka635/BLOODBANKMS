"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

export default function HospitalDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReq, setNewReq] = useState({ blood_group: "A+", units: 1, price_per_unit: 1500 });
  const hospital_id = typeof window !== "undefined" ? localStorage.getItem("hospital_id") : null;
  const hospital_name = typeof window !== "undefined" ? localStorage.getItem("hospital_name") : null;

  useEffect(() => {
    if (!hospital_id) {
      router.push("/hospital/login");
      return;
    }
    fetchRequests();
  }, [hospital_id]);

  async function fetchRequests() {
    try {
      setLoading(true);
      const res = await fetch(`/api/hospital/requests?hospital_id=${hospital_id}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createRequest(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/hospital/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospital_id, ...newReq }),
      });
      if (res.ok) {
        fetchRequests();
      } else {
        alert("Request failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function markPaid(request_id) {
    try {
      const res = await fetch("/api/hospital/pay", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id }),
      });
      if (res.ok) fetchRequests();
      else alert("Unable to update payment");
    } catch (err) { console.error(err); }
  }

  return (
    <div style={{ background: "linear-gradient(to bottom, #fff5f5, #ffffff)", minHeight: "100vh", padding: 30 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-danger">Hospital Dashboard</h2>
          <div>
            <strong>{hospital_name}</strong>
            <button className="btn btn-outline-danger ms-3" onClick={() => { localStorage.removeItem("hospital_id"); localStorage.removeItem("hospital_name"); router.push("/hospital/login"); }}>
              Logout
            </button>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm p-3">
              <h5 className="text-danger">New Blood Request</h5>
              <form onSubmit={createRequest}>
                <div className="mb-2">
                  <label className="form-label">Blood Group</label>
                  <select className="form-select" value={newReq.blood_group} onChange={(e)=>setNewReq({...newReq,blood_group:e.target.value})}>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Units</label>
                  <input type="number" min="1" className="form-control" value={newReq.units} onChange={(e)=>setNewReq({...newReq,units:Number(e.target.value)})}/>
                </div>
                <div className="mb-2">
                  <label className="form-label">Price / Unit (₹)</label>
                  <input type="number" className="form-control" value={newReq.price_per_unit} onChange={(e)=>setNewReq({...newReq,price_per_unit:Number(e.target.value)})}/>
                </div>
                <button className="btn btn-danger w-100 mt-2">Submit Request</button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm p-3">
              <h5 className="text-danger">Your Requests</h5>
              {loading ? <p>Loading...</p> : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-danger">
                      <tr>
                        <th>Blood Group</th>
                        <th>Units</th>
                        <th>Total Cost (₹)</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.length === 0 ? (
                        <tr><td colSpan="6" className="text-center">No requests yet</td></tr>
                      ) : requests.map((r) => (
                        <tr key={r.id}>
                          <td>{r.blood_group}</td>
                          <td>{r.units}</td>
                          <td>{r.total_cost}</td>
                          <td>{r.status}</td>
                          <td>{r.payment_status}</td>
                          <td>
                            {r.payment_status === "unpaid" && (
                              <button className="btn btn-sm btn-success" onClick={()=>markPaid(r.id)}>Mark Paid</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
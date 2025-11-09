"use client";

import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-danger">🩸 Blood Bank Management System</h1>
        <p className="text-muted">Select your role to continue</p>
      </div>

      <div className="d-flex flex-column gap-3">
        <button
          className="btn btn-outline-danger fw-semibold px-5"
          onClick={() => router.push("/admin/login")}
        >
          Admin Login
        </button>
        <button
          className="btn btn-outline-danger fw-semibold px-5"
          onClick={() => router.push("/donor/signup")}
        >
          Donor Registration
        </button>
        <button
          className="btn btn-outline-danger fw-semibold px-5"
          onClick={() => router.push("/hospital/register")}
        >
          Hospital Login / Register
        </button>
      </div>

      <footer className="mt-5 text-muted small">
        © {new Date().getFullYear()} Blood Bank | Made with ❤
      </footer>
    </div>
  );
}
// src/app/api/hospital/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { hospital_name, email, hospital_code, address, contact } = body;

    if (!hospital_name || !email || !hospital_code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO hospitals (hospital_name, email, hospital_code, address, contact)
       VALUES (?, ?, ?, ?, ?)`,
      [hospital_name, email, hospital_code, address || "", contact || ""]
    );

    return NextResponse.json({ success: true, message: "Hospital registered" });
  } catch (err) {
    console.error("Hospital register error:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Hospital already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id, hospital_name, email, hospital_code, address, contact FROM hospitals ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Hospital list error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
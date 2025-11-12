// src/app/api/hospital/requests/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { hospital_id, blood_group, units, price_per_unit } = await req.json();
    if (!hospital_id || !blood_group || !units) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // default price if not provided
    const price = price_per_unit ? Number(price_per_unit) : 1500.0;

    await pool.query(
      `INSERT INTO hospital_requests (hospital_id, blood_group, units, price_per_unit)
       VALUES (?, ?, ?, ?)`,
      [hospital_id, blood_group, units, price]
    );

    return NextResponse.json({ success: true, message: "Request submitted" });
  } catch (err) {
    console.error("Create request error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hospital_id = searchParams.get("hospital_id");
    if (!hospital_id) {
      return NextResponse.json({ error: "Missing hospital_id" }, { status: 400 });
    }

    const [rows] = await pool.query(
      `SELECT id, blood_group, units, price_per_unit, total_cost, status, payment_status, request_date
       FROM hospital_requests
       WHERE hospital_id = ?
       ORDER BY request_date DESC`,
      [hospital_id]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Fetch requests error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
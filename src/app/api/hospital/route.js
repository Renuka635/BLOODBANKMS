import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  const body = await req.json();
  try {
    const { hospital_name, email, hospital_id, address, contact_number } = body;
    await pool.query(
      "INSERT INTO hospitals (hospital_name, email, hospital_id, address, contact_number) VALUES (?, ?, ?, ?, ?)",
      [hospital_name, email, hospital_id, address, contact_number]
    );
    await pool.query(
      "INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)",
      [hospital_name, email, contact_number, 'hospital', 'hospital123']
    );
    return NextResponse.json({ success: true, message: "Hospital registered successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
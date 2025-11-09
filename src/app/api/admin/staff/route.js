import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ➕ Add or Assign Staff
export async function POST(req) {
  try {
    const { name, role, phone, email } = await req.json();
    await pool.query(
      "INSERT INTO staff (name, role, phone, email) VALUES (?, ?, ?, ?)",
      [name, role, phone, email]
    );
    return NextResponse.json({ message: "Staff added successfully!" });
  } catch (err) {
    console.error("Add staff error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📋 Fetch All Staff
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM staff");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Fetch staff error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
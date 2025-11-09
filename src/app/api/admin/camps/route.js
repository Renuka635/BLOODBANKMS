import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ➕ Add New Camp
export async function POST(req) {
  try {
    const { camp_name, location, date } = await req.json();
    await pool.query(
      "INSERT INTO blood_camps (camp_name, location, date) VALUES (?, ?, ?)",
      [camp_name, location, date]
    );
    return NextResponse.json({ message: "Camp added successfully!" });
  } catch (err) {
    console.error("Add camp error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📋 Fetch All Camps
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM blood_camps ORDER BY date ASC");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Fetch camps error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
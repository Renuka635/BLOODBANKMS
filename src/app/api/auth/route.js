import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  const body = await req.json();
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email=? AND password=?",
      [body.email, body.password]
    );
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid credentials" });
    }
    return NextResponse.json({ success: true, role: rows[0].role });
  } catch (err) {
    console.error("Auth Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
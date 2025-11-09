import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  const body = await req.json();
  try {
    const { name, email, phone, blood_group } = body;
    await pool.query(
      "INSERT INTO donors (name, email, phone, blood_group) VALUES (?, ?, ?, ?)",
      [name, email, phone, blood_group]
    );
    await pool.query(
      "INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, 'donor', 'donor123']
    );
    return NextResponse.json({ success: true, message: "Donor registered successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
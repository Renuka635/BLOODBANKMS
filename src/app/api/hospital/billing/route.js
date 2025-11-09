import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { hospital_id, blood_group, quantity } = await req.json();

    // Assume price per unit = ₹1500
    const total_amount = quantity * 1500;

    await pool.query(
      "INSERT INTO billing (hospital_id, blood_group, quantity, total_amount) VALUES (?, ?, ?, ?)",
      [hospital_id, blood_group, quantity, total_amount]
    );

    return NextResponse.json({ message: "Billing record created successfully" });
  } catch (err) {
    console.error("Billing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT b.id, h.hospital_name, b.blood_group, b.quantity, b.total_amount, b.billing_date
      FROM billing b
      JOIN hospitals h ON b.hospital_id = h.id
      ORDER BY b.billing_date DESC
    `);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Billing fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
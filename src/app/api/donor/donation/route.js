import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { donor_id, camp_id, donation_date } = await req.json();

    await pool.query(
      "INSERT INTO donations (donor_id, camp_id, donation_date) VALUES (?, ?, ?)",
      [donor_id, camp_id, donation_date]
    );

    return NextResponse.json({ message: "Donation recorded successfully!" });
  } catch (err) {
    console.error("Donation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, r.name AS donor_name, c.camp_name, c.location, d.donation_date
      FROM donations d
      JOIN donors r ON d.donor_id = r.id
      JOIN blood_camps c ON d.camp_id = c.id
      ORDER BY d.donation_date DESC
    `);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Donation fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
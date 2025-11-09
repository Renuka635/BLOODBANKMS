import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ➕ Assign Staff to Camp
export async function POST(req) {
  try {
    const { camp_id, staff_id, assigned_date } = await req.json();
    await pool.query(
      "INSERT INTO camp_staff (camp_id, staff_id, assigned_date) VALUES (?, ?, ?)",
      [camp_id, staff_id, assigned_date]
    );
    return NextResponse.json({ message: "Staff assigned successfully!" });
  } catch (err) {
    console.error("Assign staff error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📋 View Assignments
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT cs.id, c.camp_name, s.name AS staff_name, s.role, cs.assigned_date
      FROM camp_staff cs
      JOIN blood_camps c ON cs.camp_id = c.id
      JOIN staff s ON cs.staff_id = s.id
      ORDER BY cs.assigned_date DESC
    `);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Fetch assignments error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
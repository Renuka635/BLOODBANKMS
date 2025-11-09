import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM blood_camps ORDER BY date ASC");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error fetching camps:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT id, hospital_id, hospital_name, status FROM billing ORDER BY id DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Billing GET Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { hospital_id, hospital_name, status } = body;

    if (!hospital_id || !hospital_name || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await pool.query(
      "INSERT INTO billing (hospital_id, hospital_name, status) VALUES (?, ?, ?)",
      [hospital_id, hospital_name, status]
    );

    return NextResponse.json({ message: "Billing updated successfully" });
  } catch (error) {
    console.error("Billing POST Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM blood_stock");
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, quantity } = await req.json();
    await pool.query("UPDATE blood_stock SET quantity = ? WHERE id = ?", [quantity, id]);
    return NextResponse.json({ message: "Updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
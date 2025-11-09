import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group");

    let query = "SELECT * FROM blood_stock";
    let params = [];

    if (group) {
      query += " WHERE blood_group LIKE ?";
      params.push(`%${group}%`);
    }

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error fetching stock:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
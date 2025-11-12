// src/app/api/hospital/pay/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req) {
  try {
    const { request_id } = await req.json();
    if (!request_id) return NextResponse.json({ error: "Missing request_id" }, { status: 400 });

    await pool.query("UPDATE hospital_requests SET payment_status = 'paid' WHERE id = ?", [request_id]);
    return NextResponse.json({ success: true, message: "Payment marked as paid" });
  } catch (err) {
    console.error("Payment update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
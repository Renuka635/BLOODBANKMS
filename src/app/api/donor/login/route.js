import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check donor
    const donorQuery = "SELECT * FROM donors WHERE name = ? AND email = ?";
    const [donor] = await db.query(donorQuery, [name, email]);

    if (!donor || donor.length === 0) {
      return NextResponse.json({ error: "Donor not found. Please register first." }, { status: 404 });
    }

    // Get donor camp details
    const campQuery = "SELECT camp_name, location, date FROM blood_camps WHERE id = ?";
    const [camp] = await db.query(campQuery, [donor[0].camp_id]);

    if (!camp || camp.length === 0) {
      return NextResponse.json({ error: "Camp details not found" }, { status: 404 });
    }

    return NextResponse.json({
      camp: camp[0].camp_name,
      location: camp[0].location,
      date: camp[0].date,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error during login" },
      { status: 500 }
    );
  }
}
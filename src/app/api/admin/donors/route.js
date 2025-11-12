import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// ✅ Create a database connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "633010", // 🔸 add your MySQL password if you have one
  database: "blood_bank",
});

// 🩸 GET → Fetch all donors
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM donors ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching donors:", error);
    return NextResponse.json({ error: "Failed to fetch donors" }, { status: 500 });
  }
}

// ➕ POST → Add new donor
export async function POST(request) {
  try {
    const { name, email, age, bloodGroup, camp } = await request.json();

    if (!name || !email || !bloodGroup || !age || !camp) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO donors (name, email, age, bloodGroup, camp) VALUES (?, ?, ?, ?, ?)",
      [name, email, age, bloodGroup, camp]
    );

    return NextResponse.json({ message: "Donor added successfully", id: result.insertId });
  } catch (error) {
    console.error("Error adding donor:", error);
    return NextResponse.json({ error: "Failed to add donor" }, { status: 500 });
  }
}

// ✏ PUT → Update donor (for admin manual edit)
export async function PUT(request) {
  try {
    const { id, name, email, age, bloodGroup, camp } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing donor ID" }, { status: 400 });
    }

    await pool.query(
      "UPDATE donors SET name=?, email=?, age=?, bloodGroup=?, camp=? WHERE id=?",
      [name, email, age, bloodGroup, camp, id]
    );

    return NextResponse.json({ message: "Donor updated successfully" });
  } catch (error) {
    console.error("Error updating donor:", error);
    return NextResponse.json({ error: "Failed to update donor" }, { status: 500 });
  }
}
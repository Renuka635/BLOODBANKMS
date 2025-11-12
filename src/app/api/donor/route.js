import pool from "@/lib/db";

export async function POST(req) {
  const { name, email, phone, blood_group, campId } = await req.json();
  try {
    await pool.query(
      "INSERT INTO donors (name, email, phone, blood_group, campId) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, blood_group, campId]
    );
    return new Response(JSON.stringify({ message: "Registered" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error registering donor" }), { status: 500 });
  }
}
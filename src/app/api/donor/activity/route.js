import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  try {
    const [rows] = await pool.query(
      `SELECT d.name, d.blood_group, c.camp_name, c.location, c.date 
       FROM donors d 
       JOIN blood_camps c ON d.campId = c.id 
       WHERE d.name = ? AND d.email = ?`,
      [name, email]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error fetching activity" }), { status: 500 });
  }
}
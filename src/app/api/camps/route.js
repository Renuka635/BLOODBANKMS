import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM blood_camps ORDER BY date ASC");
  return new Response(JSON.stringify(rows), { status: 200 });
}
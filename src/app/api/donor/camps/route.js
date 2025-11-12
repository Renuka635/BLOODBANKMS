import mysql from "mysql2/promise";

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "633010",
      database: "blood_bank",
    });

    const [rows] = await db.execute(
      "SELECT id, camp_name, location, date FROM blood_camps ORDER BY date ASC"
    );

    db.end();
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("Error fetching camps:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch camps" }), { status: 500 });
  }
}
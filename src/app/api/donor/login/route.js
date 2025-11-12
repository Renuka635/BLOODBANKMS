import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { email, phone } = await req.json();

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "blood_bank", // change if needed
    });

    // ✅ Join donor with blood_camps to get full details
    const [rows] = await connection.execute(
      `SELECT d.name, d.blood_group, c.camp_name, c.location, c.date
       FROM donors d
       LEFT JOIN blood_camps c ON d.camp_id = c.id
       WHERE d.email = ? AND d.phone = ?`,
      [email, phone]
    );

    await connection.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error("Error during donor login:", error);
    return new Response(
      JSON.stringify({ message: "Error logging in", error: error.message }),
      { status: 500 }
    );
  }
}
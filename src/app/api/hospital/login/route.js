import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { email, hospital_id } = await req.json();

    // Connect to MySQL
    const db = await mysql.createConnection({
      host: "localhost", // or your MySQL host
      user: "root",      // your MySQL username
      password: "633010",      // your MySQL password
      database: "blood_bank", // your database name
    });

    // Check if hospital exists
    const [rows] = await db.execute(
      "SELECT * FROM hospitals WHERE email = ? AND hospital_id = ?",
      [email, hospital_id]
    );

    await db.end();

    if (rows.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Login successful",
          hospital: rows[0],
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid Hospital ID or Email" }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in hospital login:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
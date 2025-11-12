import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const {
      name,
      email,
      phone,
      blood_group,
      camp_id,
    } = await req.json();

    // ✅ Connect to your MySQL database
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "633010",
      database: "blood_bank", // change if yours differs
    });

    // ✅ Insert donor into the donors table
    await connection.execute(
      `INSERT INTO donors (name, email, phone, blood_group, camp_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, blood_group, camp_id]
    );

    await connection.end();

    return new Response(
      JSON.stringify({ message: "Registration successful!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during donor registration:", error);
    return new Response(
      JSON.stringify({ message: "Error registering donor", error: error.message }),
      { status: 500 }
    );
  }
}
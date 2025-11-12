import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const {
      hospital_name,
      email,
      hospital_id,
      address,
      contact_number,
      blood_stock,
      requested_units,
    } = await req.json();

    // Validate input
    if (
      !hospital_name ||
      !email ||
      !hospital_id ||
      !address ||
      !contact_number
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "633010",
      database: "blood_bank",
    });

    await connection.execute(
      `INSERT INTO hospitals (hospital_name, email, hospital_id, address, contact_number, blood_stock, requested_units)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        hospital_name,
        email,
        hospital_id,
        address,
        contact_number,
        blood_stock || "Not specified",
        requested_units || "None",
      ]
    );

    await connection.end();

    return new Response(JSON.stringify({ message: "Hospital registered successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in hospital register API:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
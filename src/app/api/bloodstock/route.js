import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "633010",
    database: "blood_bank",
  });

  const [rows] = await connection.execute(
    "SELECT blood_group, quantity FROM blood_stock"
  );

  return NextResponse.json(rows);
}
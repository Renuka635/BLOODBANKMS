import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "633010",
  database: "blood_bank",
});

export default pool;
import "dotenv/config";
import mysql from "mysql2/promise";

let db: mysql.Connection;

async function databaseConnection() {
  if (!db) {
    const dbName = process.env.DB_NAME || process.env.DATABASE_NAME;
    if (!dbName) {
      throw new Error(
        "Missing database name env var. Define DB_NAME or DATABASE_NAME in .env"
      );
    }

    db = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: dbName,
    });

    console.log(`Database connection established. Using schema: ${dbName}`);
  }
  return db;
}

export default databaseConnection;

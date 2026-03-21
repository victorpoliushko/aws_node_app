import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const isLocal =
  process.env.DB_URL?.includes("localhost") ||
  process.env.DB_URL?.includes("127.0.0.1");

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

export default pool;

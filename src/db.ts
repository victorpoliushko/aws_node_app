import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5433'),
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

export default pool;

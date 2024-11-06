import { Pool } from 'pg';
import { configDotenv } from 'dotenv';

configDotenv();


const DB_PORT = process.env.PG_DATABASE_PORT
? parseInt(process.env.PG_DATABASE_PORT)
: 5432;

// Configure database connection
const dbPool = new Pool({
  user: process.env.PG_DATABASE_USER,
  host: process.env.PG_DATABASE_HOST,
  database: process.env.PG_DATABASE_NAME,
  port:  DB_PORT,
  max: 10,
  idleTimeoutMillis: 30000
});

export default dbPool;

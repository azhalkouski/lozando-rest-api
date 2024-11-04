import { Client } from 'pg';
import { configDotenv } from 'dotenv';

configDotenv();


const DB_PORT = process.env.PG_DATABASE_PORT
? parseInt(process.env.PG_DATABASE_PORT)
: 5432;

// Configure database connection
const client = new Client({
  user: process.env.PG_DATABASE_USER,
  host: process.env.PG_DATABASE_HOST,
  database: process.env.PG_DATABASE_NAME,
  port:  DB_PORT,
});

export default client;

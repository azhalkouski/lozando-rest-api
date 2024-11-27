import { Pool } from 'pg';


// Configure database connection
const dbPool = new Pool({
  user: process.env.PG_DEV_DATABASE_USER,
  host: process.env.PG_DEV_DATABASE_HOST,
  database: process.env.PG_DEV_DATABASE_NAME,
  port:  parseInt(process.env.PG_DEV_DATABASE_PORT || '5432'),
  max: 10,
  idleTimeoutMillis: 30000
});

export default dbPool;

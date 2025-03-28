import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import migrate from 'node-pg-migrate';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '../migrations');

const { Pool } = pg;

const db = new Pool({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: 'main_db',
  user: 'admin',
  password: process.env.POSTGRES_PASSWORD,
});

async function assertDBConnection() {
  const client = await db.connect();
  const result = await client.query('SELECT NOW()');
  if (!result.rows[0].now) {
    throw new Error('Database connection failed: ' + result.rows[0].now);
  }
  client.release();
}

async function runMigrationCommand(direction, options = {}) {
  await assertDBConnection();
  
  try {
    console.log(`Running migration ${direction}...`);
    const result = await migrate({
      dbClient: db,
      migrationsTable: 'pgmigrations',
      dir: migrationsDir,
      direction,
      ...options
    });
    
    if (result && result.length > 0) {
      console.log(`Applied ${result.length} migrations successfully.`);
    } else {
      console.log('No migrations to apply.');
    }
    
    return result;
  } finally {
    await closeDatabase();
  }
}

function closeDatabase() {
  return db.end();
}

export {
  db,
  assertDBConnection,
  runMigrationCommand,
  closeDatabase
};

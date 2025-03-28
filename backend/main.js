import { startApiServer } from './apiServer.js';
import { db, assertDBConnection, closeDatabase } from './database.js';

main();
async function main() {
  await assertDBConnection();
  
  startApiServer();
}

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database connections.');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database connections.');
  await closeDatabase();
  process.exit(0);
});

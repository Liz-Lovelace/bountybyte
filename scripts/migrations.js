import { runMigrationCommand } from '../backend/database.js';

const command = process.argv[2] || 'up';

switch (command) {
  case 'up':
    runMigrationCommand('up');
    break;
  case 'down':
    runMigrationCommand('down', { count: 1 });
    break;
  default:
    console.error('Unknown command. Use: up, down, or redo');
    process.exit(1);
} 
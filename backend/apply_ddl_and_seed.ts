import mysql from 'mysql2/promise';
import { readFile } from 'fs/promises';
import path from 'path';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';

// Try multiple candidate locations for the migrations directory so the script works
// whether it's invoked from the top-level workspace or the `SensorLinker` subfolder.
function findMigrationFile(filename: string) {
  const candidates = [
    path.resolve(process.cwd(), 'migrations', filename),
    path.resolve(process.cwd(), 'SensorLinker', 'migrations', filename),
    path.resolve(process.cwd(), 'SensorLinker', 'SensorLinker', 'migrations', filename),
  ];
  for (const p of candidates) {
    try {
      // quick existence check
      require('fs').accessSync(p);
      return p;
    } catch {}
  }
  // fallback to first candidate (will error later with clear path)
  return candidates[0];
}

const ddlPath = findMigrationFile('ddl_rapport.sql');
const seedPath = findMigrationFile('seed_rapport.sql');

async function run() {
  try {
    console.log('Reading DDL from', ddlPath);
    const ddl = await readFile(ddlPath, 'utf8');
    console.log('Reading seed from', seedPath);
    const seed = await readFile(seedPath, 'utf8');

    console.log('Connecting to MySQL at', `${host}:${port}`);
    const conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true });

    console.log('Applying DDL...');
    await conn.query(ddl);
    console.log('DDL applied.');

    console.log('Applying seed...');
    await conn.query(seed);
    console.log('Seed applied.');

    await conn.end();
    console.log('Done — database should now match `ddl_rapport.sql` + `seed_rapport.sql`.');
  } catch (err) {
    console.error('Failed to apply DDL/seed:', err);
    process.exitCode = 1;
  }
}

run();

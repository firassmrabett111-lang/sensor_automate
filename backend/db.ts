import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";
import { readFile } from 'fs/promises';
import path from 'path';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = process.env.MYSQL_DATABASE || 'sousse_smart_city_projet_module';

let db: any = null;
let connectionError: Error | null = null;
let isInitialized = false;

async function ensureDatabase() {
  try {
    // create a temporary connection without specifying database to ensure it exists
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;`);
    await connection.end();
  } catch (error) {
    throw error;
  }
}

async function ensureSchema() {
  // Prefer applying a PDF-derived migration if present, otherwise fallback to the original migration
  const candidates = [
    path.resolve(import.meta.dirname, '..', '..', 'migrations', 'ddl_rapport.sql'),
    path.resolve(import.meta.dirname, '..', 'migrations', 'rebuild-from-pdf.sql'),
    path.resolve(import.meta.dirname, '..', 'migrations', 'create-smart_city_sousse.sql'),
  ];

  for (const migrationsPath of candidates) {
    try {
      const sql = await readFile(migrationsPath, 'utf-8');
      const connection = await mysql.createConnection({ host, port, user, password, multipleStatements: true });
      // split and execute statements safely
      const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
      for (const stmt of statements) {
        try {
          if (!stmt) continue;
          await connection.query(stmt);
        } catch (innerErr) {
          // Ignore errors for individual statements (e.g., table already exists)
          console.warn(`Migration statement failed (continuing): ${innerErr && innerErr.message ? innerErr.message : innerErr}`);
        }
      }
      await connection.end();
      // applied successfully, stop after first successful migration
      return;
    } catch (err) {
      // try next candidate
      console.warn(`Could not apply migration ${migrationsPath}:`, err.message || err);
    }
  }
}

async function initializeDatabase() {
  try {
    await ensureDatabase();
    await ensureSchema();
    const pool = mysql.createPool({ host, port, user, password, database });
    db = drizzle(pool, { schema, mode: 'default' });
    isInitialized = true;
    console.log('[INFO] Connected to MySQL database');
  } catch (err: any) {
    connectionError = err;
    console.error('[WARNING] Could not connect to MySQL database:', err.message || err);
    console.log('[INFO] Using in-memory storage as fallback');
    db = null;
    isInitialized = true;
  }
}

await initializeDatabase();

export { db, connectionError, isInitialized };

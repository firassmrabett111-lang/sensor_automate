import { pool } from './db';

// Minimal idempotent insertion for the sensor UUID referenced by the seed
const UUID = 'ffa098af-d029-4667-b612-0b656e4937e2';

async function run() {
  try {
    // Use INSERT ... ON DUPLICATE KEY UPDATE to avoid violating unique constraints if it already exists
    const sql = `INSERT INTO sensors (uuid, owner_id, type, location, statut)
      VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE uuid = uuid`;

    const params = [UUID, 1, 'CO2', 'Insertion-for-seed', 'actif'];

    const [result] = await (pool as any).query(sql, params);
    console.log('Insert result:', result);
  } catch (err) {
    console.error('Failed to insert missing sensor:', err);
    process.exitCode = 1;
  } finally {
    try { await (pool as any).end(); } catch (e) {}
  }
}

run();

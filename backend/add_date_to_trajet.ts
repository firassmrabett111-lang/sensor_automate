
import { db } from './db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Adding Date column to Trajet table...');
  try {
    await db.execute(sql`ALTER TABLE \`Trajet\` ADD COLUMN \`Date\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    console.log('Successfully added Date column.');
  } catch (error: any) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Column Date already exists.');
    } else {
      console.error('Error adding column:', error);
    }
  }
  process.exit(0);
}

main().catch(console.error);

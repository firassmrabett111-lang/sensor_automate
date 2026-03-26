import fs from 'fs/promises';
import mysql from 'mysql2/promise';

async function main(){
  // path to the SQL in the repo root migrations folder
  const sqlPath = new URL('../../migrations/seed_sousse_data.sql', import.meta.url).pathname;
  const sql = await fs.readFile(sqlPath, 'utf8');

  const host = process.env.MYSQL_HOST ?? '127.0.0.1';
  const port = Number(process.env.MYSQL_PORT ?? 3306);
  const user = process.env.MYSQL_USER ?? 'root';
  const password = process.env.MYSQL_PASSWORD ?? '';
  const database = process.env.MYSQL_DATABASE ?? 'sousse_smart_city_projet_module';

  console.log('Connecting to MySQL %s:%d as %s (database: %s)', host, port, user, database);
  const conn = await mysql.createConnection({host, port, user, password, database, multipleStatements: true});

  try{
    console.log('Executing seed SQL...');
    const [result] = await conn.query(sql);
    console.log('Seed executed successfully.');
  }catch(err){
    console.error('Error executing seed:', err);
    process.exitCode = 1;
  }finally{
    await conn.end();
  }
}

main().catch((e)=>{ console.error(e); process.exit(1); });

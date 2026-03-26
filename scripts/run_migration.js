const fs = require('fs/promises');
const mysql = require('mysql2/promise');

(async ()=>{
  try{
    const sql = await fs.readFile('./migrations/normalize-to-bcnf.sql', 'utf8');
    const stmts = sql.split(/;\s*\n/).map(s=>s.trim()).filter(Boolean);
    const host = process.env.MYSQL_HOST || '127.0.0.1';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';
    const database = process.env.MYSQL_DATABASE || 'smart_city_sousse';
    console.log('Connecting to', host, 'database', database, 'user', user ? user : '(empty user)');
    const conn = await mysql.createConnection({ host, user, password, multipleStatements: false });
    // ensure DB exists
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;`);
    // run statements sequentially
    await conn.changeUser({database});
    for(const s of stmts){
      try{
        // skip comments-only lines
        if(s.startsWith('--') || /^\/\*/.test(s)) continue;
        await conn.query(s);
      }catch(e){
        console.error('Failed statement start:', s.slice(0,200));
        throw e;
      }
    }
    console.log('Migration script executed successfully');
    await conn.end();
  }catch(err){
    console.error('Migration failed', err);
    process.exit(1);
  }
})();

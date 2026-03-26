const fs = require('fs/promises');
const mysql = require('mysql2/promise');
(async ()=>{
  try{
    const arg = process.argv[2] || './migrations/remove-certification.sql';
    const sql = await fs.readFile(arg, 'utf8');
    const sqlProcessed = sql.replace(/IF EXISTS/g,'');
    const stmts = sqlProcessed.split(/;\s*\n/).map(s=>s.trim()).filter(Boolean);
    const host = process.env.MYSQL_HOST || '127.0.0.1';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';
    const database = process.env.MYSQL_DATABASE || 'smart_city_sousse';
    console.log('Connecting to', host, 'database', database, 'user', user ? user : '(empty user)');
    const conn = await mysql.createConnection({ host, user, password, multipleStatements: false });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;`);
    await conn.changeUser({database});
    for(const s of stmts){
      try{
        if(s.startsWith('--') || s.startsWith('/*')) continue;
        console.log('RUN:', s.split('\n')[0].slice(0,200));
        await conn.query(s);
      }catch(e){
        const ignorable = ['ER_DUP_KEYNAME','ER_DUP_FIELDNAME','ER_COLUMN_EXISTS_ERROR','ER_CANT_AGGREGATE_2ARGS','ER_CANT_DROP_FIELD_OR_KEY','ER_NO_SUCH_TABLE','ER_BAD_FIELD_ERROR','ER_CANT_DROP_FIELD_OR_KEY'];
        if(e && ignorable.includes(e.code)){
          console.warn('Ignorable error (skipping):', e.code, e.message);
          continue;
        }
        console.error('Failed statement:', e.code, e.message);
        throw e;
      }
    }
    console.log('SQL file executed successfully');
    await conn.end();
  }catch(err){
    console.error('Execution failed', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();

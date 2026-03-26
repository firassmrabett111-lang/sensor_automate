const mysql = require('mysql2/promise');
(async()=>{
  try{
    const conn = await mysql.createConnection({ host: '127.0.0.1', user: 'root', password: '', database: 'smart_city_sousse' });
    const stmts = [
      `SET FOREIGN_KEY_CHECKS=0`,
      `ALTER TABLE technicians DROP FOREIGN KEY fk_technicians_certification`,
      `ALTER TABLE technicians DROP COLUMN certification_id`,
      `ALTER TABLE technicians DROP COLUMN certification`,
      `DROP TABLE IF EXISTS certification_levels`,
      `SET FOREIGN_KEY_CHECKS=1`,
    ];
    for(const s of stmts){
      try{
        console.log('RUN:', s);
        await conn.query(s);
      }catch(e){
        console.warn('Statement failed (ignored):', e.code || e.message);
      }
    }
    await conn.end();
    console.log('remove-certification: done');
  }catch(e){
    console.error('remove-certification failed', e.stack||e.message);
    process.exit(1);
  }
})();

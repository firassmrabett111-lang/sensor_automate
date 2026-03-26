const mysql = require('mysql2/promise');
(async ()=>{
  const cfg = { host: '127.0.0.1', user: 'root', password: '', database: 'sousse_smart_city_projet_module' };
  try{
    const conn = await mysql.createConnection(cfg);
    const tables = ['vehicule','Véhicule'];
    const out = {};
    for(const t of tables){
      // check existence
      const [exists] = await conn.query('SELECT COUNT(*) AS c FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?', [cfg.database, t]);
      if(exists[0].c===0){ out[t] = { exists: false }; continue; }
      const [count] = await conn.query(`SELECT COUNT(*) AS c FROM \`${t}\``);
      const n = count[0].c;
      const [rows] = await conn.query(`SELECT * FROM \`${t}\` LIMIT 5`);
      out[t] = { exists: true, count: n, sample: rows };
    }
    console.log(JSON.stringify(out, null, 2));
    await conn.end();
  }catch(e){ console.error('ERR', e.message); process.exit(2); }
})();

const mysql = require('mysql2/promise');
(async ()=>{
  try{
    const conn = await mysql.createConnection({ host: '127.0.0.1', user: 'root', password: '', database: 'sousse_smart_city_projet_module' });
    const res = {};
    const [p] = await conn.query('SELECT COUNT(*) AS cnt FROM `Propriétaire`'); res.proprietaire = p[0].cnt;
    const [c] = await conn.query('SELECT COUNT(*) AS cnt FROM `Capteur`'); res.capteur = c[0].cnt;
    const [i] = await conn.query('SELECT COUNT(*) AS cnt FROM `Intervention`'); res.intervention = i[0].cnt;
    const [m1] = await conn.query('SELECT COUNT(*) AS cnt FROM `Mesures1`'); res.mesures1 = m1[0].cnt;
    const [m2] = await conn.query('SELECT COUNT(*) AS cnt FROM `Mesures2`'); res.mesures2 = m2[0].cnt;
    console.log(JSON.stringify(res, null, 2));
    await conn.end();
  }catch(e){ console.error('VERIFY SCRIPT ERROR:', e.message); process.exit(1); }
})();

const mysql = require('mysql2/promise');
const fs = require('fs');
(async ()=>{
  try{
    const ddlPath = 'C:/Users/Mrabet/Desktop/projet DB/SensorLinker/migrations/ddl_rapport.sql';
    console.log('Reading DDL from', ddlPath);
    let ddl = fs.readFileSync(ddlPath, 'utf8');
    ddl = ddl.replace(/CREATE DATABASE IF NOT EXISTS `smart_city_sousse`;/g, "CREATE DATABASE IF NOT EXISTS `sousse_smart_city_projet_module`; ");
    ddl = ddl.replace(/USE `smart_city_sousse`;/g, "USE `sousse_smart_city_projet_module`; ");

    const conn = await mysql.createConnection({ host: '127.0.0.1', user: 'root', password: '', multipleStatements: true });
    console.log('Applying DDL to `sousse_smart_city_projet_module`...');
    await conn.query(ddl);
    console.log('DDL applied successfully to target DB');
    await conn.end();
  }catch(e){
    console.error('Runner error:', e.message);
    process.exit(1);
  }
})();

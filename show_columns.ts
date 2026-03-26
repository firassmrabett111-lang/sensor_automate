import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_city_sousse'
});

const [rows] = await connection.execute('SHOW COLUMNS FROM Mesures1');
console.log('Mesures1 Columns:');
rows.forEach(row => console.log(`  - ${row.Field}: ${row.Type}`));
await connection.end();
process.exit(0);

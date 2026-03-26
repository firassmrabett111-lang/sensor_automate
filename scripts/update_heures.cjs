const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'sousse_smart_city_projet_module'
};

async function updateHeures() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Updating NULL heure values in Participation table...\n');
    
    // Update all NULL heure values with a default time
    const [result] = await connection.query(`
      UPDATE Participation 
      SET Heure = '14:30'
      WHERE Heure IS NULL
    `);
    
    console.log(`Updated ${result.affectedRows} rows\n`);
    
    // Verify the update
    const [updated] = await connection.query('SELECT * FROM Participation');
    console.log('Updated Participation records:');
    console.log(updated);
    
  } finally {
    await connection.end();
  }
}

updateHeures().catch(console.error);

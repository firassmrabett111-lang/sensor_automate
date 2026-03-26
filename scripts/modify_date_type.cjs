const mysql = require('mysql2/promise');

(async ()=>{
  try{
    const host = process.env.MYSQL_HOST || '127.0.0.1';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';
    const database = process.env.MYSQL_DATABASE || 'sousse_smart_city_projet_module';
    
    console.log('Connexion à', host, 'database', database);
    const conn = await mysql.createConnection({ host, user, password, database });
    
    // Modifier le type de la colonne Date
    console.log('\nModification du type de la colonne Date de DATETIME vers DATE...');
    await conn.query('ALTER TABLE `Participation` MODIFY COLUMN `Date` DATE');
    console.log('✅ Colonne Date modifiée avec succès!');
    
    // Vérifier la structure de la table
    const [columns] = await conn.query('DESCRIBE Participation');
    console.log('\n📋 Structure mise à jour de la table Participation:\n');
    for (const col of columns) {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    }
    
    // Afficher les données existantes pour vérifier le format
    const [rows] = await conn.query('SELECT * FROM Participation LIMIT 5');
    if (rows.length > 0) {
      console.log('\n📊 Exemple de données (les 5 premières lignes):\n');
      console.table(rows);
    }
    
    await conn.end();
    console.log('\n✅ Terminé! La colonne Date ne contient maintenant que la date (YYYY-MM-DD)');
  }catch(err){
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
})();

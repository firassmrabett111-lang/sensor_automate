const mysql = require('mysql2/promise');

(async ()=>{
  try{
    const host = process.env.MYSQL_HOST || '127.0.0.1';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';
    const database = process.env.MYSQL_DATABASE || 'sousse_smart_city_projet_module';
    
    console.log('Connexion à', host, 'database', database);
    const conn = await mysql.createConnection({ host, user, password, database });
    
    try {
      // Essayer d'ajouter la colonne
      console.log('\nAjout de la colonne Heure...');
      await conn.query('ALTER TABLE `Participation` ADD COLUMN `Heure` VARCHAR(10) AFTER `Date`');
      console.log('✅ Colonne Heure ajoutée avec succès!');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ La colonne Heure existe déjà');
      } else {
        throw e;
      }
    }
    
    // Vérifier la structure de la table
    const [columns] = await conn.query('DESCRIBE Participation');
    console.log('\n📋 Structure de la table Participation:\n');
    for (const col of columns) {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    }
    
    await conn.end();
    console.log('\n✅ Terminé!');
  }catch(err){
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
})();

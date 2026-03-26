import mysql from 'mysql2/promise';

async function addNumeroTechnicien() {
  let connection;
  try {
    console.log('🔄 Connexion à la base de données...\n');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sousse_smart_city_projet_module'
    });

    console.log('✅ Connecté!\n');

    // Vérifier si la colonne existe déjà
    console.log('🔍 Vérification de la colonne Numero...\n');
    const [columns] = await connection.execute(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Technicien' AND COLUMN_NAME = 'Numero'"
    );

    if (columns.length > 0) {
      console.log('✅ La colonne Numero existe déjà!');
      console.log('\n📊 Structure actuelle de la table Technicien:');
      const [schema] = await connection.execute("DESCRIBE Technicien");
      console.log(schema);
    } else {
      // Ajouter la colonne
      console.log('📝 Ajout de la colonne Numero...\n');
      await connection.execute(
        "ALTER TABLE `Technicien` ADD COLUMN `Numero` VARCHAR(20) DEFAULT NULL AFTER `Nom`"
      );
      console.log('✅ Colonne Numero ajoutée avec succès!\n');
      
      console.log('📊 Structure mise à jour de la table Technicien:');
      const [schema] = await connection.execute("DESCRIBE Technicien");
      schema.forEach((col) => {
        console.log(`  ${col.Field.padEnd(20)} | ${col.Type.padEnd(25)} | ${col.Null} | Key: ${col.Key || 'NONE'}`);
      });
    }

    console.log('\n✨ Migration complétée avec succès!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

addNumeroTechnicien();

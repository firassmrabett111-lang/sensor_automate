import mysql from 'mysql2/promise';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = 'sousse_smart_city_projet_module';

async function revertToLocalisation() {
  let connection;
  try {
    console.log('🔄 Conversion vers colonne Localisation unique...\n');

    connection = await mysql.createConnection({ host, port, user, password, database });

    // Vérifier si les colonnes Latitude et Longitude existent
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Capteur'
    `, [database]);

    const existingColumns = (columns as any[]).map((c: any) => c.COLUMN_NAME);
    const hasLatitude = existingColumns.includes('Latitude');
    const hasLongitude = existingColumns.includes('Longitude');
    const hasLocalisation = existingColumns.includes('Localisation');

    console.log('État actuel:');
    console.log(`   - Latitude: ${hasLatitude ? '✅' : '❌'}`);
    console.log(`   - Longitude: ${hasLongitude ? '✅' : '❌'}`);
    console.log(`   - Localisation: ${hasLocalisation ? '✅' : '❌'}\n`);

    // Si Localisation n'existe pas, la créer
    if (!hasLocalisation) {
      console.log('➕ Création de la colonne Localisation...');
      await connection.query(`ALTER TABLE Capteur ADD COLUMN Localisation VARCHAR(255) AFTER Type`);
      console.log('   ✅ Colonne Localisation créée\n');
    }

    // Si Latitude et Longitude existent, fusionner dans Localisation
    if (hasLatitude && hasLongitude) {
      console.log('🔄 Fusion Latitude/Longitude dans Localisation...');
      const [result] = await connection.query(`
        UPDATE Capteur 
        SET Localisation = CONCAT(Latitude, ',', Longitude)
        WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL
      `);
      console.log(`   ✅ ${(result as any).affectedRows} capteur(s) mis à jour\n`);

      // Supprimer les colonnes Latitude et Longitude
      console.log('🗑️  Suppression des colonnes Latitude et Longitude...');
      await connection.query(`ALTER TABLE Capteur DROP COLUMN Latitude`);
      await connection.query(`ALTER TABLE Capteur DROP COLUMN Longitude`);
      console.log('   ✅ Colonnes supprimées\n');
    }

    // Afficher le résultat
    console.log('📊 Résultat final:\n');
    const [capteurs] = await connection.query(`
      SELECT UUID, Type, Localisation, Statut 
      FROM Capteur 
      LIMIT 5
    `);

    if ((capteurs as any[]).length > 0) {
      console.log('Capteurs avec Localisation:');
      (capteurs as any[]).forEach((c: any, i: number) => {
        console.log(`   ${i + 1}. ${c.Type.padEnd(20)} ${c.Localisation || 'N/A'.padEnd(25)} ${c.Statut}`);
      });
    }

    console.log('\n✨ Migration terminée!');
    console.log('📍 Format Localisation: "latitude,longitude"\n');

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

revertToLocalisation();

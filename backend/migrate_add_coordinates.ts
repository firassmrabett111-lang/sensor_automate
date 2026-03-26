import mysql from 'mysql2/promise';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = 'sousse_smart_city_projet_module';

async function applyMigration() {
  let connection;
  try {
    console.log('🔄 Application de la migration des coordonnées géographiques...\n');

    connection = await mysql.createConnection({ host, port, user, password, database });

    console.log('✅ Connexion établie à la base de données\n');

    // Vérifier si la table Capteur existe
    const [tables] = await connection.query(`SHOW TABLES LIKE 'Capteur'`);
    if ((tables as any).length === 0 && (tables as any).length === 0) {
      console.log('⚠️  La table Capteur n\'existe pas encore.');
      console.log('   Elle sera créée automatiquement avec le schéma ddl_rapport.sql\n');
      return;
    }

    console.log('📊 Vérification de la structure actuelle de la table Capteur...\n');

    // Vérifier si les colonnes existent déjà
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Capteur' AND COLUMN_NAME IN ('Latitude', 'Longitude', 'Localisation')
    `, [database]);

    const existingColumns = (columns as any[]).map((c: any) => c.COLUMN_NAME);
    const hasLatitude = existingColumns.includes('Latitude');
    const hasLongitude = existingColumns.includes('Longitude');
    const hasLocalisation = existingColumns.includes('Localisation');

    console.log('Colonnes existantes:');
    console.log(`   - Latitude: ${hasLatitude ? '✅' : '❌'}`);
    console.log(`   - Longitude: ${hasLongitude ? '✅' : '❌'}`);
    console.log(`   - Localisation: ${hasLocalisation ? '✅' : '❌'}\n`);

    // Ajouter Latitude si elle n'existe pas
    if (!hasLatitude) {
      console.log('➕ Ajout de la colonne Latitude...');
      await connection.query(`ALTER TABLE Capteur ADD COLUMN Latitude DECIMAL(9,6) AFTER Type`);
      console.log('   ✅ Colonne Latitude ajoutée\n');
    }

    // Ajouter Longitude si elle n'existe pas
    if (!hasLongitude) {
      console.log('➕ Ajout de la colonne Longitude...');
      await connection.query(`ALTER TABLE Capteur ADD COLUMN Longitude DECIMAL(9,6) AFTER ${hasLatitude ? 'Latitude' : 'Type'}`);
      console.log('   ✅ Colonne Longitude ajoutée\n');
    }

    // Mettre à jour les coordonnées NULL avec le centre de Sousse
    console.log('🔄 Mise à jour des coordonnées manquantes...');
    const [result] = await connection.query(`
      UPDATE Capteur 
      SET Latitude = 35.825600, Longitude = 10.637000
      WHERE Latitude IS NULL OR Longitude IS NULL
    `);

    const affectedRows = (result as any).affectedRows;
    if (affectedRows > 0) {
      console.log(`   ✅ ${affectedRows} capteur(s) mis à jour avec les coordonnées par défaut\n`);
    } else {
      console.log('   ℹ️  Aucun capteur à mettre à jour\n');
    }

    // Afficher un résumé
    console.log('📊 Résumé de la migration:\n');
    const [capteurs] = await connection.query(`
      SELECT UUID, Type, Latitude, Longitude, Statut 
      FROM Capteur 
      LIMIT 5
    `);

    if ((capteurs as any[]).length > 0) {
      console.log('Exemples de capteurs avec coordonnées:');
      (capteurs as any[]).forEach((c: any, i: number) => {
        console.log(`   ${i + 1}. ${c.Type} - (${c.Latitude}, ${c.Longitude}) - ${c.Statut}`);
      });
    }

    console.log('\n✨ Migration terminée avec succès!');
    console.log('📍 Les capteurs peuvent maintenant être affichés sur la carte géographique.\n');

  } catch (error: any) {
    console.error('❌ Erreur lors de la migration:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

applyMigration();

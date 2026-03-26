import mysql from 'mysql2/promise';
import { readFile } from 'fs/promises';
import path from 'path';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = 'sousse_smart_city_projet_module';

async function applySeedData() {
  try {
    console.log('🌱 Application des données de seed...\n');

    const seedPath = 'c:\\\\Users\\\\Mrabet\\\\Desktop\\\\projet DB\\\\SensorLinker\\\\migrations\\\\seed_sousse_data.sql';
    console.log(`📂 Lecture du fichier: ${seedPath}`);

    const sql = await readFile(seedPath, 'utf-8');
    console.log('✅ Fichier SQL chargé\n');

    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true
    });

    console.log('✅ Connexion établie\n');
    console.log('⚙️  Exécution des instructions SQL...\n');

    // Exécuter le script SQL
    await connection.query(sql);

    console.log('✅ Données de seed insérées avec succès!\n');

    // Vérifier quelques données
    const [proprietaires] = await connection.query('SELECT COUNT(*) as count FROM `Propriétaire`');
    const [capteurs] = await connection.query('SELECT COUNT(*) as count FROM `Capteur`');
    const [citoyens] = await connection.query('SELECT COUNT(*) as count FROM `Citoyen`');
    const [vehicules] = await connection.query('SELECT COUNT(*) as count FROM `Véhicule`');

    console.log('📊 Résumé des données insérées:');
    console.log(`   - Propriétaires: ${proprietaires[0].count}`);
    console.log(`   - Capteurs: ${capteurs[0].count}`);
    console.log(`   - Citoyens: ${citoyens[0].count}`);
    console.log(`   - Véhicules: ${vehicules[0].count}`);

    console.log('\n✨ Migration et seed terminés avec succès!');

    await connection.end();

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.sql) {
      console.error('SQL problématique:', error.sql);
    }
    process.exit(1);
  }
}

applySeedData();

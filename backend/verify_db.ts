import mysql from 'mysql2/promise';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = 'sousse_smart_city_projet_module';

async function verifyDatabase() {
  try {
    console.log('🔍 Connexion à MySQL...');
    const connection = await mysql.createConnection({ host, port, user, password });

    // Vérifier que la base de données existe
    console.log(`\n✅ Connexion réussie à MySQL`);
    console.log(`📊 Vérification du schéma: ${database}`);

    const [databases] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [database]
    );

    if (databases.length === 0) {
      console.log(`❌ La base de données '${database}' n'existe pas encore.`);
      await connection.end();
      return;
    }

    console.log(`✅ La base de données '${database}' existe!\n`);

    // Utiliser la base de données
    await connection.query(`USE \`${database}\``);

    // Lister les tables
    const [tables] = await connection.query('SHOW TABLES');

    if (tables.length === 0) {
      console.log('⚠️  Aucune table trouvée dans la base de données.');
    } else {
      console.log(`📋 Tables trouvées (${tables.length}):\n`);
      tables.forEach((row, index) => {
        const tableName = Object.values(row)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
    }

    console.log(`\n✨ Vérification terminée avec succès!`);
    await connection.end();

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

verifyDatabase();

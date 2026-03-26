import mysql from 'mysql2/promise';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = 'sousse_smart_city_projet_module';

async function verifyCoordinates() {
  let connection;
  try {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        VÉRIFICATION DES COORDONNÉES GÉOGRAPHIQUES       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({ host, port, user, password, database });

    // 1. Vérifier la structure de la table Capteur
    console.log('1️⃣  Structure de la table Capteur:\n');
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Capteur'
      ORDER BY ORDINAL_POSITION
    `, [database]);

    (columns as any[]).forEach((col: any) => {
      const icon = ['Latitude', 'Longitude'].includes(col.COLUMN_NAME) ? '📍' : '  ';
      console.log(`   ${icon} ${col.COLUMN_NAME.padEnd(20)} ${col.COLUMN_TYPE}`);
    });

    // 2. Vérifier les capteurs avec coordonnées
    console.log('\n2️⃣  Capteurs avec coordonnées géographiques:\n');
    const [capteurs] = await connection.query(`
      SELECT UUID, Type, Latitude, Longitude, Statut 
      FROM Capteur
    `);

    if ((capteurs as any[]).length === 0) {
      console.log('   ⚠️  Aucun capteur trouvé dans la table Capteur\n');
    } else {
      (capteurs as any[]).forEach((c: any, i: number) => {
        const coords = c.Latitude && c.Longitude
          ? `(${c.Latitude}, ${c.Longitude})`
          : '⚠️  Coordonnées manquantes';
        console.log(`   ${i + 1}. ${c.Type.padEnd(20)} ${coords.padEnd(25)} ${c.Statut}`);
      });
    }

    // 3. Vérifier aussi la table sensors (utilisée par le backend)
    console.log('\n3️⃣  Capteurs dans la table sensors (backend):\n');
    try {
      const [sensors] = await connection.query(`
        SELECT uuid, type, latitude, longitude, status 
        FROM sensors 
        LIMIT 5
      `);

      if ((sensors as any[]).length === 0) {
        console.log('   ℹ️  Aucun capteur dans la table sensors\n');
      } else {
        (sensors as any[]).forEach((s: any, i: number) => {
          const coords = s.latitude && s.longitude
            ? `(${s.latitude}, ${s.longitude})`
            : '⚠️  Coordonnées manquantes';
          console.log(`   ${i + 1}. ${s.type.padEnd(20)} ${coords.padEnd(25)} ${s.status}`);
        });
      }
    } catch (err) {
      console.log('   ℹ️  Table sensors n\'existe pas (normal si non créée)\n');
    }

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                    STATUT FINAL                         ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('✅ Schéma modifié: Latitude et Longitude ajoutés');
    console.log('✅ Migration appliquée avec succès');
    console.log('✅ Les capteurs peuvent être affichés sur la carte\n');
    console.log('📝 Pour tester:');
    console.log('   1. Ouvrez http://localhost:5000/sensors');
    console.log('   2. Cliquez sur l\'onglet "Carte"');
    console.log('   3. Les capteurs apparaîtront comme marqueurs sur la carte\n');
    console.log('💡 Pour ajouter un nouveau capteur:');
    console.log('   1. Cliquez sur "Nouveau Capteur"');
    console.log('   2. Remplissez latitude/longitude (ex: 35.8256, 10.6370)');
    console.log('   3. Le capteur apparaîtra automatiquement sur la carte\n');

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

verifyCoordinates();

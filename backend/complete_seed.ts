import mysql from 'mysql2/promise';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = 'sousse_smart_city_projet_module';

async function checkAndCompleteData() {
  let connection;
  try {
    console.log(`Connecting to database: ${database} on ${host}:${port}`);
    connection = await mysql.createConnection({ host, port, user, password, database });

    console.log('📊 Vérification des données existantes...\n');

    // Vérifier et compléter les données manquantes
    const tables = [
      { name: 'Propriétaire', insert: `INSERT IGNORE INTO Propriétaire (IDP, Nom, Adresse, Téléphone, Email, Propriété) VALUES (1, 'Ville de Sousse', 'Avenue Habib Bourguiba, Sousse', '+21612345678', 'contact@sousse.gov.tn', 'Municipalité')` },
      { name: 'Technicien', insert: `INSERT IGNORE INTO Technicien (IDT, Nom) VALUES (1, 'Ali Ben Salah')` },
      { name: 'Capteur', insert: `INSERT IGNORE INTO Capteur (UUID, Type, Localisation, Statut, \`Date Installation\`, \`IDP\`) VALUES ('ffa098af-d029-4667-b612-0b656e4937e2', 'Qualité de l''air', 'Rue Ibn Khaldoun', 'Actif', NOW(), 1)` },
      { name: 'Mesures2', insert: `INSERT IGNORE INTO Mesures2 (NomGrandeur, Unité) VALUES ('CO2', 'ppm')` },
      { name: 'Citoyen', insert: `INSERT IGNORE INTO Citoyen (IDCI, Nom, Adresse, Téléphone, Email, Score, Préférences, Historique) VALUES (1, 'Fatma Trabelsi', 'Rue de la Plage', '+21698765432', 'fatma.trabelsi@example.com', 5, '{"transport":"velo"}', 'Participation: consultation 2024-06')` },
      { name: 'Consultation', insert: `INSERT IGNORE INTO Consultation (IDCO, Sujet, Mode) VALUES (1, 'Amélioration de la qualité de l\\'air', 'En ligne')` },
      { name: 'Véhicule', insert: `INSERT IGNORE INTO Véhicule (Plaque, Type, \`Énergie Utilisée\`) VALUES ('SUS-1000', 'Voiture', 'Électrique')` }
    ];

    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${table.name}\``);
      const count = (rows as any)[0].count;

      if (count === 0 && table.insert) {
        await connection.query(table.insert);
        console.log(`✅ ${table.name}: donnée de base insérée`);
      } else {
        console.log(`✓  ${table.name}: ${count} enregistrement(s)`);
      }
    }

    // Insérer données dépendantes seulement si les tables de base ont des données
    const [propCount] = await connection.query('SELECT COUNT(*) as count FROM Propriétaire');
    if ((propCount as any)[0].count > 0) {

      // Mesures1
      await connection.query(`INSERT IGNORE INTO Mesures1 (IDM, NomGrandeur, Valeur, \`UUID\`) VALUES (1, 'CO2', 412.523, 'ffa098af-d029-4667-b612-0b656e4937e2')`);

      // Intervention
      await connection.query(`INSERT IGNORE INTO Intervention (IDIn, DateHeure, Nature, Durée, Coût, ImpactCO2, \`UUID\`) VALUES (1, NOW(), 'Corrective', 30, 45.00, 0.123, 'ffa098af-d029-4667-b612-0b656e4937e2')`);

      // Supervision
      await connection.query(`INSERT IGNORE INTO Supervision (\`IDIn\`, \`IDT\`, Rôle) VALUES (1, 1, 'Intervenant')`);

      // Participation
      await connection.query(`INSERT IGNORE INTO Participation (\`IDCI\`, \`IDCO\`, Date, Heure) VALUES (1, 1, NOW(), '14:30')`);

      // Trajet
      await connection.query(`INSERT IGNORE INTO Trajet (IDTR, Origine, Destination, Durée, ÉconomieCO2, \`Plaque\`) VALUES (1, 'Centre Ville', 'Université', 25, 1.234, 'SUS-1000')`);

      console.log('✅ Toutes les données dépendantes insérées\n');
    }

    // Afficher le résumé final
    console.log('📊 Résumé final de la base de données:\n');
    const allTables = ['Propriétaire', 'Technicien', 'Capteur', 'Mesures2', 'Mesures1', 'Intervention', 'Supervision', 'Citoyen', 'Consultation', 'Participation', 'Véhicule', 'Trajet'];

    for (const table of allTables) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
      const count = (rows as any)[0].count;
      const icon = count > 0 ? '✅' : '⚠️ ';
      console.log(`   ${icon} ${table}: ${count} enregistrement(s)`);
    }

    console.log('\n✨ Base de données prête à être utilisée!');
    console.log('\n🚀 Le backend est en cours d\'exécution sur le port 5000');
    console.log('📝 Schéma: sousse_smart_city_projet_module\n');

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkAndCompleteData();

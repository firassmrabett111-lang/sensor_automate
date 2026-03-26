import mysql from 'mysql2/promise';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = 'sousse_smart_city_projet_module';

async function seedData() {
  let connection;
  try {
    console.log('🌱 Insertion des données de seed...\n');

    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database
    });

    console.log('✅ Connexion établie\n');

    // Insérer un propriétaire
    await connection.query(`
      INSERT INTO Propriétaire (Nom, Adresse, Téléphone, Email, Propriété)
      VALUES ('Ville de Sousse', 'Avenue Habib Bourguiba, Sousse', '+21612345678', 'contact@sousse.gov.tn', 'Municipalité')
      ON DUPLICATE KEY UPDATE Nom=VALUES(Nom)
    `);
    const [ownerResult] = await connection.query('SELECT LAST_INSERT_ID() as id');
    const ownerId = (ownerResult as any)[0].id;
    console.log(`✅ Propriétaire créé (ID: ${ownerId})`);

    // Insérer un technicien
    await connection.query(`
      INSERT INTO Technicien (Nom) VALUES ('Ali Ben Salah')
      ON DUPLICATE KEY UPDATE Nom=VALUES(Nom)
    `);
    const [techResult] = await connection.query('SELECT LAST_INSERT_ID() as id');
    const techId = (techResult as any)[0].id;
    console.log(`✅ Technicien créé (ID: ${techId})`);

    // Insérer un capteur
    await connection.query(`
      INSERT INTO Capteur (UUID, Type, Localisation, Statut, \`Date Installation\`, \`IDP\`)
      VALUES ('ffa098af-d029-4667-b612-0b656e4937e2', 'Qualité de l''air', 'Rue Ibn Khaldoun', 'Actif', NOW(), ?)
      ON DUPLICATE KEY UPDATE Type=VALUES(Type), Localisation=VALUES(Localisation), Statut=VALUES(Statut)
    `, [ownerId]);
    console.log('✅ Capteur créé');

    // Insérer une mesure (définition)
    await connection.query(`
      INSERT INTO Mesures2 (NomGrandeur, Unité) VALUES ('CO2', 'ppm')
      ON DUPLICATE KEY UPDATE Unité=VALUES(Unité)
    `);
    console.log('✅ Définition de mesure ajoutée');

    // Insérer une mesure (valeur)
    await connection.query(`
      INSERT INTO Mesures1 (NomGrandeur, Valeur, \`UUID\`) 
      VALUES ('CO2', 412.523, 'ffa098af-d029-4667-b612-0b656e4937e2')
    `);
    console.log('✅ Mesure ajoutée');

    // Insérer une intervention
    await connection.query(`
      INSERT INTO Intervention (DateHeure, Nature, Durée, Coût, ImpactCO2, \`UUID\`)
      VALUES (NOW(), 'Corrective', 30, 45.00, 0.123, 'ffa098af-d029-4667-b612-0b656e4937e2')
    `);
    const [intResult] = await connection.query('SELECT LAST_INSERT_ID() as id');
    const intId = (intResult as any)[0].id;
    console.log(`✅ Intervention créée (ID: ${intId})`);

    // Insérer supervision
    await connection.query(`
      INSERT IGNORE INTO Supervision (\`IDIn\`, \`IDT\`, Rôle) VALUES (?, ?, 'Intervenant')
    `, [intId, techId]);
    console.log('✅ Supervision ajoutée');

    // Insérer un citoyen
    await connection.query(`
      INSERT INTO Citoyen (Nom, Adresse, Téléphone, Email, Score, Préférences, Historique)
      VALUES ('Fatma Trabelsi', 'Rue de la Plage', '+21698765432', 'fatma.trabelsi@example.com', 5, '{"transport":"velo"}', 'Participation: consultation 2024-06')
      ON DUPLICATE KEY UPDATE Nom=VALUES(Nom)
    `);
    const [citResult] = await connection.query('SELECT LAST_INSERT_ID() as id');
    const citId = (citResult as any)[0].id;
    console.log(`✅ Citoyen créé (ID: ${citId})`);

    // Insérer une consultation
    await connection.query(`
      INSERT INTO Consultation (Sujet, Mode) VALUES ('Amélioration de la qualité de l\\'air', 'En Ligne')
      ON DUPLICATE KEY UPDATE Sujet=VALUES(Sujet)
    `);
    const [consResult] = await connection.query('SELECT LAST_INSERT_ID() as id');
    const consId = (consResult as any)[0].id;
    console.log(`✅ Consultation créée (ID: ${consId})`);

    // Insérer participation
    await connection.query(`
      INSERT IGNORE INTO Participation (\`IDCI\`, \`IDCO\`, Date, Heure) VALUES (?, ?, NOW(), '14:30')
    `, [citId, consId]);
    console.log('✅ Participation ajoutée');

    // Insérer un véhicule
    await connection.query(`
      INSERT INTO Véhicule (Plaque, Type, \`Energie Utilisée\`) 
      VALUES ('SUS-1000', 'Voiture', 'Électrique')
      ON DUPLICATE KEY UPDATE Type=VALUES(Type), \`Energie Utilisée\`=VALUES(\`Energie Utilisée\`)
    `);
    console.log('✅ Véhicule créé');

    // Insérer un trajet
    await connection.query(`
      INSERT INTO Trajet (Origine, Destination, Durée, EconomieCO2, \`Plaque\`) 
      VALUES ('Centre Ville', 'Université', 25, 1.234, 'SUS-1000')
    `);
    console.log('✅ Trajet créé');

    // Afficher le résumé
    console.log('\n📊 Résumé des données insérées:\n');
    const tables = ['Propriétaire', 'Technicien', 'Capteur', 'Mesures2', 'Mesures1', 'Intervention', 'Supervision', 'Citoyen', 'Consultation', 'Participation', 'Véhicule', 'Trajet'];

    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
      console.log(`   - ${table}: ${(rows as any)[0].count} enregistrement(s)`);
    }

    console.log('\n✨ Données de seed insérées avec succès!');

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    if (error.sql) {
      console.error('SQL problématique:', error.sql);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedData();

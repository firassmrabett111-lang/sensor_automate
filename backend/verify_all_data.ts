import mysql from 'mysql2/promise';

const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const database = 'sousse_smart_city_projet_module';

async function verifyAllData() {
  let connection;
  try {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║        VÉRIFICATION COMPLÈTE DES DONNÉES              ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({ host, port, user, password, database });

    const tables = [
      { name: 'Propriétaire', frontend: 'Owners (Propriétaires)' },
      { name: 'Capteur', frontend: 'Sensors (Capteurs)' },
      { name: 'Technicien', frontend: 'Technicians (Techniciens)' },
      { name: 'Intervention', frontend: 'Interventions' },
      { name: 'Citoyen', frontend: 'Citizens (Citoyens)' },
      { name: 'Consultation', frontend: 'Consultations' },
      { name: 'Véhicule', frontend: 'Vehicles (Véhicules)' },
      { name: 'Trajet', frontend: 'Trips (Trajets)' },
      { name: 'Mesures1', frontend: 'Sensor Measures (Mesures)' },
      { name: 'Mesures2', frontend: 'Measure Definitions' },
      { name: 'Supervision', frontend: 'Technician Assignments' },
      { name: 'Participation', frontend: 'Citizen Participation' },
    ];

    console.log('📊 État des tables:\n');

    for (const table of tables) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${table.name}\``);
        const count = (rows as any)[0].count;
        const icon = count > 0 ? '✅' : '⚠️ ';
        console.log(`${icon} ${table.name.padEnd(20)} ${String(count).padStart(3)} enregistrement(s)  → ${table.frontend}`);
      } catch (err) {
        console.log(`❌ ${table.name.padEnd(20)} Erreur: Table non trouvée`);
      }
    }

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║              EXEMPLES DE DONNÉES                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    // Propriétaires
    console.log('👥 Propriétaires:');
    const [owners] = await connection.query(`SELECT * FROM Propriétaire LIMIT 3`);
    (owners as any[]).forEach((o: any) => {
      console.log(`   - ${o.Nom} (${o.Propriété}) - ${o.Email || 'N/A'}`);
    });

    // Capteurs
    console.log('\n📡 Capteurs:');
    const [sensors] = await connection.query(`SELECT * FROM Capteur LIMIT 3`);
    (sensors as any[]).forEach((s: any) => {
      console.log(`   - ${s.Type} - ${s.Localisation || 'N/A'} - ${s.Statut}`);
    });

    // Techniciens
    console.log('\n🔧 Techniciens:');
    const [techs] = await connection.query(`SELECT * FROM Technicien LIMIT 3`);
    (techs as any[]).forEach((t: any) => {
      console.log(`   - ${t.Nom}`);
    });

    // Citoyens
    console.log('\n👨‍👩‍👧‍👦 Citoyens:');
    const [citizens] = await connection.query(`SELECT * FROM Citoyen LIMIT 3`);
    (citizens as any[]).forEach((c: any) => {
      console.log(`   - ${c.Nom} - Score: ${c.Score || 0}`);
    });

    // Véhicules
    console.log('\n🚗 Véhicules:');
    const [vehicles] = await connection.query(`SELECT * FROM Véhicule LIMIT 3`);
    (vehicles as any[]).forEach((v: any) => {
      console.log(`   - ${v.Plaque} (${v.Type}) - ${v['Énergie Utilisée'] || v['Energie Utilisée']}`);
    });

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                  PAGES FRONTEND                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    console.log('✅ /dashboard       - Vue d\'ensemble avec statistiques');
    console.log('✅ /sensors         - Liste et carte des capteurs');
    console.log('✅ /interventions   - Gestion des interventions');
    console.log('✅ /technicians     - Liste des techniciens');
    console.log('✅ /citizens        - Gestion des citoyens');
    console.log('✅ /vehicles        - Gestion des véhicules');
    console.log('✅ /analytics       - Analyses et graphiques');

    console.log('\n🚀 Application disponible sur: http://localhost:5000\n');

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

verifyAllData();

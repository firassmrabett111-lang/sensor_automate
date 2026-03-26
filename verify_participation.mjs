import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'sousse_smart_city_projet_module'
});

try {
  console.log('\n✅ ═══════════════════════════════════════');
  console.log('✅ Vérification des relations');
  console.log('✅ ═══════════════════════════════════════\n');

  // Afficher consultations et participations
  const [consultations] = await conn.query(`
    SELECT 
      c.IDCO AS 'Consultation_ID',
      c.IDCI AS 'Consultation_CitizenID',
      c.Sujet,
      c.Mode,
      COUNT(DISTINCT p.IDCI) AS 'Participation_CitizenCount'
    FROM Consultation c
    LEFT JOIN Participation p ON c.IDCO = p.IDCO
    GROUP BY c.IDCO
    ORDER BY c.IDCO DESC
  `);

  console.log('=== CONSULTATIONS ===');
  console.table(consultations);

  const [participations] = await conn.query(`
    SELECT 
      p.IDPA AS 'Participation_ID',
      p.IDCI AS 'CitizenID',
      c.Nom AS 'CitizenName',
      p.IDCO AS 'ConsultationID',
      cons.Sujet AS 'ConsultationTopic',
      p.Date,
      p.Heure
    FROM Participation p
    LEFT JOIN Citoyen c ON p.IDCI = c.IDCI
    LEFT JOIN Consultation cons ON p.IDCO = cons.IDCO
    ORDER BY p.IDPA DESC
  `);

  console.log('\n=== PARTICIPATIONS ===');
  console.table(participations);

  // Vérifier l'intégrité
  const [integrity] = await conn.query(`
    SELECT 
      'Intégrité' AS Check_Type,
      COUNT(DISTINCT c.IDCO) AS Total_Consultations,
      COUNT(DISTINCT p.IDPA) AS Total_Participations,
      COUNT(DISTINCT p.IDCI) AS Unique_Citizens,
      SUM(CASE WHEN p.IDCI = c.IDCI THEN 1 ELSE 0 END) AS 'Participation_CitizenMatch'
    FROM Consultation c
    LEFT JOIN Participation p ON c.IDCO = p.IDCO
  `);

  console.log('\n=== INTÉGRITÉ ===');
  console.table(integrity);

  console.log('\n✅ ═══════════════════════════════════════');
  console.log('✅ Vérification complète!');
  console.log('✅ ═══════════════════════════════════════\n');

} finally {
  await conn.end();
  process.exit(0);
}

import { db } from './backend/db';
import { consultations, participations } from './shared/schema';
import { sql } from 'drizzle-orm';

async function recreateData() {
  try {
    console.log('\n=== RECREATING CONSULTATIONS AND PARTICIPATIONS ===\n');

    // Insert consultations (avec les nouveaux IDs citoyens: 58, 59, 60, 61)
    const consultData = [
      { citizenId: 58, topic: "qualité d'air", mode: 'En ligne' },
      { citizenId: 59, topic: "qualité d'air", mode: 'En ligne' },
      { citizenId: 59, topic: "qualité d'air", mode: 'En ligne' },
      { citizenId: 59, topic: "qualté air", mode: 'En ligne' },
    ];

    console.log('Inserting consultations...');
    const consultIds = [];
    for (const cons of consultData) {
      const result = await db.insert(consultations).values(cons);
      const inserted = await db.select().from(consultations).orderBy((t) => t.id).then(r => r[r.length - 1]);
      consultIds.push(inserted.id);
      console.log(`  ✅ IDCO=${inserted.id}, IDCI=${cons.citizenId}, Topic=${cons.topic}`);
    }

    // Insert participations
    const partData = [
      { citizenId: 58, consultationId: consultIds[0], date: new Date('2025-12-05'), heure: '01:25' },
      { citizenId: 59, consultationId: consultIds[1], date: new Date('2025-12-05'), heure: '01:25' },
      { citizenId: 59, consultationId: consultIds[2], date: new Date('2025-12-06'), heure: '01:26' },
      { citizenId: 59, consultationId: consultIds[3], date: new Date('2025-12-05'), heure: '01:47' },
    ];

    console.log('\nInserting participations...');
    for (const part of partData) {
      await db.insert(participations).values(part);
      console.log(`  ✅ IDCI=${part.citizenId}, IDCO=${part.consultationId}, Date=${part.date}`);
    }

    // Verify
    console.log('\n--- VERIFICATION ---');
    const allCons = await db.execute(
      sql`SELECT IDCO, IDCI, Sujet FROM Consultation ORDER BY IDCO`
    );
    
    console.log('Consultations:');
    (allCons as any[])[0].forEach((c: any) => {
      console.log(`  IDCO=${c.IDCO}, IDCI=${c.IDCI}, Sujet=${c.Sujet}`);
    });

    const allPart = await db.execute(
      sql`SELECT IDCI, IDCO, Date FROM Participation ORDER BY IDCO`
    );
    
    console.log('\nParticipations:');
    (allPart as any[])[0].forEach((p: any) => {
      console.log(`  IDCI=${p.IDCI}, IDCO=${p.IDCO}, Date=${p.Date}`);
    });

    console.log('\n✅ Data recreated successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

recreateData();

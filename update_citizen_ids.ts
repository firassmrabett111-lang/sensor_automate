import { db } from './backend/db';
import { sql } from 'drizzle-orm';

async function updateIds() {
  try {
    console.log('\n=== UPDATING IDs TO MATCH NEW CITIZENS ===\n');

    // Mapping: old ID -> new ID
    const idMapping = {
      54: 58,  // firas mrabet
      55: 59,  // mohamed
      56: 60,  // youssef
      57: 61   // sami
    };

    console.log('Updating Participation table...');
    for (const [oldId, newId] of Object.entries(idMapping)) {
      await db.execute(
        sql`UPDATE Participation SET IDCI = ${newId} WHERE IDCI = ${oldId}`
      );
      console.log(`  ✅ IDCI: ${oldId} → ${newId}`);
    }

    console.log('\nUpdating Consultation table...');
    for (const [oldId, newId] of Object.entries(idMapping)) {
      await db.execute(
        sql`UPDATE Consultation SET IDCI = ${newId} WHERE IDCI = ${oldId}`
      );
      console.log(`  ✅ IDCI: ${oldId} → ${newId}`);
    }

    // Verify
    console.log('\n--- VERIFICATION ---');
    const consultations = await db.execute(
      sql`SELECT IDCO, IDCI, Sujet FROM Consultation ORDER BY IDCO`
    );
    
    console.log('Consultations:');
    (consultations as any[])[0].forEach((c: any) => {
      console.log(`  IDCO=${c.IDCO}, IDCI=${c.IDCI}, Sujet=${c.Sujet}`);
    });

    const participations = await db.execute(
      sql`SELECT IDCI, IDCO, Date FROM Participation ORDER BY IDCO`
    );
    
    console.log('\nParticipations:');
    (participations as any[])[0].forEach((p: any) => {
      console.log(`  IDCI=${p.IDCI}, IDCO=${p.IDCO}, Date=${p.Date}`);
    });

    console.log('\n✅ All IDs updated!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

updateIds();

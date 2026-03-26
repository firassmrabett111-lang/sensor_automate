import { db } from './backend/db';
import { citizens, consultations, participations } from './shared/schema';

async function verify() {
  try {
    console.log('\n=== FINAL VERIFICATION ===\n');

    const allCitizens = await db.select().from(citizens);
    console.log('Citizens:');
    allCitizens.forEach(c => {
      console.log(`  ID=${c.id}, Name=${c.name}`);
    });

    const allConsultations = await db.select({
      idco: consultations.id,
      idci: consultations.citizenId,
      sujet: consultations.topic,
    }).from(consultations);
    
    console.log('\nConsultations:');
    allConsultations.forEach(c => {
      console.log(`  IDCO=${c.idco}, IDCI=${c.idci}, Sujet=${c.sujet}`);
    });

    const allParticipations = await db.select({
      idci: participations.citizenId,
      idco: participations.consultationId,
      date: participations.date,
    }).from(participations);
    
    console.log('\nParticipations:');
    allParticipations.forEach(p => {
      console.log(`  IDCI=${p.idci}, IDCO=${p.idco}, Date=${p.date}`);
    });

    console.log('\n✅ Verification complete');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

verify();

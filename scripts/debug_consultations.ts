import { storage } from '../backend/storage';

async function debugConsultations() {
  try {
    console.log('Fetching consultations from backend...\n');
    const consultations = await storage.getConsultations();

    console.log(`Found ${consultations.length} consultations\n`);

    consultations.forEach((c, index) => {
      console.log(`Consultation ${index + 1}:`);
      console.log(`  ID: ${c.id}`);
      console.log(`  Topic: ${c.topic}`);
      console.log(`  Citizen ID: ${c.citizenId}`);
      console.log(`  Citizen Name: ${c.citizenName || 'NULL/UNDEFINED'}`);
      console.log(`  Date: ${c.date}`);
      console.log(`  Mode: ${c.participationMode}`);
      console.log(`  Heure: ${c.heure || 'NULL/UNDEFINED'}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

debugConsultations();

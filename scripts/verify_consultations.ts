
import { storage } from '../backend/storage';

async function verifyConsultations() {
  try {
    console.log('Fetching consultations...');
    const consultations = await storage.getConsultations();

    if (consultations.length === 0) {
      console.log('No consultations found.');
    } else {
      console.log(`Found ${consultations.length} consultations.`);
      const firstConsultation = consultations[0];
      console.log('First consultation sample:', firstConsultation);

      if (firstConsultation.heure) {
        console.log('SUCCESS: "heure" field is present.');
      } else {
        console.log('FAILURE: "heure" field is MISSING.');
      }
    }
  } catch (error) {
    console.error('Error verifying consultations:', error);
  } finally {
    process.exit(0);
  }
}

verifyConsultations();

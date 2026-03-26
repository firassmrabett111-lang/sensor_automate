
import { storage } from './storage';

async function main() {
  console.log('Fetching trips via storage.getTrips()...');
  try {
    const trips = await storage.getTrips();
    console.log(JSON.stringify(trips, null, 2));
  } catch (error) {
    console.error('Error fetching trips:', error);
  }
  process.exit(0);
}

main().catch(console.error);

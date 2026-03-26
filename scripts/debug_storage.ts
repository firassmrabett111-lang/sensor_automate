
import { storage } from "../backend/storage";

async function main() {
  try {
    console.log("Testing storage.getConsultations()...");
    const results = await storage.getConsultations();
    console.log("Results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Error calling getConsultations:", error);
  } finally {
    process.exit(0);
  }
}

main();

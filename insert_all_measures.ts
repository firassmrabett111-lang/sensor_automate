import { db } from "./backend/db.js";
import { sql } from "drizzle-orm";

async function insertAllMeasures() {
  try {
    console.log("🔄 Insertion de toutes les mesures...\n");

    // 1. CAPTEUR QUALITÉ DE L'AIR
    const airSensorId = "376e6436-0d6a-4334-ba01-276867685e48";
    const airData = [
      { nom: "CO2", valeurs: [425.3, 418.7, 431.2, 422.1, 428.5, 435.2, 420.9, 433.7] },
      { nom: "Température", valeurs: [22.5, 21.8, 23.2, 24.1, 23.5, 22.1, 21.5, 23.8] },
    ];

    for (const type of airData) {
      for (const val of type.valeurs) {
        await db.execute(
          sql`INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (${type.nom}, ${val}, ${airSensorId})`
        );
      }
    }
    console.log("✅ Capteur Air: CO2 + Température insérés");

    // 2. CAPTEUR TRAFIC
    const trafficSensorId = "56c39c21-451d-4a57-ba70-24700e8c246e";
    const trafficData = [
      { nom: "Densité Trafic", valeurs: [45.2, 62.8, 38.5, 55.3, 68.9, 75.2, 42.6, 51.1] },
      { nom: "Vitesse Moyenne", valeurs: [35.5, 28.3, 42.1, 31.7, 25.2, 22.8, 38.4, 33.6] },
      { nom: "Congestion", valeurs: [35.2, 52.8, 28.5, 45.3, 58.9, 65.2, 32.6, 41.1] },
    ];

    for (const type of trafficData) {
      for (const val of type.valeurs) {
        await db.execute(
          sql`INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (${type.nom}, ${val}, ${trafficSensorId})`
        );
      }
    }
    console.log("✅ Capteur Trafic: Densité + Vitesse + Congestion insérés");

    // 3. CAPTEUR ÉCLAIRAGE
    const lightingSensorId = "7aff9bb8-1f83-4798-8380-8717d9dfdd1d";
    const lightingData = [
      { nom: "Luminosité", valeurs: [450.5, 520.8, 380.2, 410.3, 490.9, 550.2, 390.6, 440.1] },
      { nom: "Consommation", valeurs: [85.3, 95.2, 72.5, 80.8, 88.6, 92.1, 75.9, 82.2] },
      { nom: "État Ampoule", valeurs: [0, 0, 0, 0, 0, 0, 0, 0] },
    ];

    for (const type of lightingData) {
      for (const val of type.valeurs) {
        await db.execute(
          sql`INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (${type.nom}, ${val}, ${lightingSensorId})`
        );
      }
    }
    console.log("✅ Capteur Éclairage: Luminosité + Consommation + État insérés");

    // 4. CAPTEUR ÉNERGIE
    const energySensorId = "9a5e219f-3636-4ca8-bea3-b5f31b76645b";
    const energyData = [
      { nom: "Consommation Énergie", valeurs: [125.5, 142.8, 98.2, 115.3, 138.9, 152.2, 105.6, 128.1] },
      { nom: "Tension", valeurs: [230.5, 229.8, 231.2, 230.1, 229.5, 230.8, 231.1, 230.2] },
      { nom: "Courant", valeurs: [18.5, 21.2, 15.8, 19.3, 22.1, 23.5, 17.2, 20.3] },
    ];

    for (const type of energyData) {
      for (const val of type.valeurs) {
        await db.execute(
          sql`INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (${type.nom}, ${val}, ${energySensorId})`
        );
      }
    }
    console.log("✅ Capteur Énergie: Consommation + Tension + Courant insérés");

    // 5. CAPTEUR DÉCHETS
    const wasteSensorId = "a20c9983-d335-4785-99c5-990f16e0f9df";
    const wasteData = [
      { nom: "Niveau Remplissage", valeurs: [45.2, 52.8, 38.5, 48.3, 55.9, 62.2, 41.6, 50.1] },
      { nom: "Collectes Jour", valeurs: [3, 4, 2, 3, 5, 4, 2, 3] },
      { nom: "Poids Estimé", valeurs: [185.5, 215.8, 155.2, 195.3, 225.9, 252.2, 165.6, 200.1] },
    ];

    for (const type of wasteData) {
      for (const val of type.valeurs) {
        await db.execute(
          sql`INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (${type.nom}, ${val}, ${wasteSensorId})`
        );
      }
    }
    console.log("✅ Capteur Déchets: Niveau + Collectes + Poids insérés");

    console.log("\n✨ Toutes les mesures ont été insérées avec succès!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

insertAllMeasures();

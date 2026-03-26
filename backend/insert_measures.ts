import { db } from "./db";
import { sensorMeasures } from "@shared/schema";
import { sql } from "drizzle-orm";

async function insertMeasuresData() {
  try {
    console.log("[MESURES] Début de l'insertion des données de mesures...\n");

    // ÉTAPE 1: Insérer les grandeurs manquantes dans Mesures2
    console.log("[ÉTAPE 1] Ajout des grandeurs dans Mesures2...");
    
    const grandeurs = [
      { nom: "PM2.5", unite: "µg/m³" },
      { nom: "PM10", unite: "µg/m³" },
      { nom: "NO2", unite: "ppb" },
      { nom: "CO2", unite: "ppm" },
      { nom: "Température", unite: "°C" },
      { nom: "Densité Trafic", unite: "véh/km" },
      { nom: "Vitesse Moyenne", unite: "km/h" },
      { nom: "Congestion", unite: "%" },
      { nom: "Luminosité", unite: "lux" },
      { nom: "État Ampoule", unite: "0/1" },
      { nom: "Consommation Énergie", unite: "kWh" },
      { nom: "Tension", unite: "V" },
      { nom: "Courant", unite: "A" },
      { nom: "Niveau Remplissage", unite: "%" },
      { nom: "Collectes Jour", unite: "nombre" },
      { nom: "Poids Estimé", unite: "kg" },
    ];

    for (const g of grandeurs) {
      try {
        // Vérifier si la grandeur existe déjà
        const exists = await db.execute(
          sql`SELECT COUNT(*) as cnt FROM mesures2 WHERE NomGrandeur = ${g.nom}`
        );
        
        if (exists[0][0].cnt === 0) {
          await db.execute(
            sql`INSERT INTO mesures2 (NomGrandeur, Unité) VALUES (${g.nom}, ${g.unite})`
          );
          console.log(`  ✓ ${g.nom} (${g.unite})`);
        } else {
          console.log(`  • ${g.nom} (existe déjà)`);
        }
      } catch (e) {
        console.log(`  ⚠ ${g.nom} - erreur: ${(e as any).message?.split(':')[0]}`);
      }
    }

    console.log("\n[ÉTAPE 2] Insertion des mesures dans Mesures1...\n");

    // 1. Capteur Qualité de l'air
    const airSensorId = "376e6436-0d6a-4334-ba01-276867685e48";
    const airData = [
      { grandeur: "PM2.5", values: [45.2, 52.8, 38.5, 41.3, 48.9, 55.2, 39.6, 44.1] },
      { grandeur: "PM10", values: [78.4, 89.2, 65.3, 72.8, 85.6, 92.1, 68.9, 76.2] },
      { grandeur: "NO2", values: [28.5, 35.2, 22.1, 26.8, 32.1, 36.5, 24.8, 28.9] },
      { grandeur: "CO2", values: [412.5, 425.3, 418.7, 431.2, 428.5, 435.1, 420.3, 426.8] },
      { grandeur: "Température", values: [22.5, 21.8, 23.2, 24.1, 23.5, 22.1, 21.5, 23.8] },
    ];

    let count = 0;
    for (const sensor of airData) {
      for (const value of sensor.values) {
        await db.insert(sensorMeasures).values({
          sensorId: airSensorId,
          grandeur: sensor.grandeur,
          value: value,
        });
        count++;
      }
    }
    console.log(`✓ Capteur Air: ${count} mesures (${airData.length} types)`);

    // 2. Capteur Trafic
    const trafficSensorId = "56c39c21-451d-4a57-ba70-24700e8c246e";
    const trafficData = [
      { grandeur: "Densité Trafic", values: [45.2, 62.8, 38.5, 55.3, 68.9, 75.2, 42.6, 51.1] },
      { grandeur: "Vitesse Moyenne", values: [35.5, 28.3, 42.1, 31.7, 25.2, 22.8, 38.4, 33.6] },
      { grandeur: "Congestion", values: [35.2, 52.8, 28.5, 45.3, 58.9, 65.2, 32.6, 41.1] },
    ];

    count = 0;
    for (const sensor of trafficData) {
      for (const value of sensor.values) {
        await db.insert(sensorMeasures).values({
          sensorId: trafficSensorId,
          grandeur: sensor.grandeur,
          value: value,
        });
        count++;
      }
    }
    console.log(`✓ Capteur Trafic: ${count} mesures (${trafficData.length} types)`);

    // 3. Capteur Éclairage
    const lightingSensorId = "7aff9bb8-1f83-4798-8380-8717d9dfdd1d";
    const lightingData = [
      { grandeur: "Luminosité", values: [450.5, 520.8, 380.2, 410.3, 490.9, 550.2, 390.6, 440.1] },
      { grandeur: "Consommation", values: [85.3, 95.2, 72.5, 80.8, 88.6, 92.1, 75.9, 82.2] },
      { grandeur: "État Ampoule", values: [0, 0, 0, 0, 0, 0, 0, 0] },
    ];

    count = 0;
    for (const sensor of lightingData) {
      for (const value of sensor.values) {
        await db.insert(sensorMeasures).values({
          sensorId: lightingSensorId,
          grandeur: sensor.grandeur,
          value: value,
        });
        count++;
      }
    }
    console.log(`✓ Capteur Éclairage: ${count} mesures (${lightingData.length} types)`);

    // 4. Capteur Énergie
    const energySensorId = "9a5e219f-3636-4ca8-bea3-b5f31b76645b";
    const energyData = [
      { grandeur: "Consommation Énergie", values: [125.5, 142.8, 98.2, 115.3, 138.9, 152.2, 105.6, 128.1] },
      { grandeur: "Tension", values: [230.5, 229.8, 231.2, 230.1, 229.5, 230.8, 231.1, 230.2] },
      { grandeur: "Courant", values: [18.5, 21.2, 15.8, 19.3, 22.1, 23.5, 17.2, 20.3] },
    ];

    count = 0;
    for (const sensor of energyData) {
      for (const value of sensor.values) {
        await db.insert(sensorMeasures).values({
          sensorId: energySensorId,
          grandeur: sensor.grandeur,
          value: value,
        });
        count++;
      }
    }
    console.log(`✓ Capteur Énergie: ${count} mesures (${energyData.length} types)`);

    // 5. Capteur Déchets
    const wasteSensorId = "a20c9983-d335-4785-99c5-990f16e0f9df";
    const wasteData = [
      { grandeur: "Niveau Remplissage", values: [45.2, 52.8, 38.5, 48.3, 55.9, 62.2, 41.6, 50.1] },
      { grandeur: "Collectes Jour", values: [3, 4, 2, 3, 5, 4, 2, 3] },
      { grandeur: "Poids Estimé", values: [185.5, 215.8, 155.2, 195.3, 225.9, 252.2, 165.6, 200.1] },
    ];

    count = 0;
    for (const sensor of wasteData) {
      for (const value of sensor.values) {
        await db.insert(sensorMeasures).values({
          sensorId: wasteSensorId,
          grandeur: sensor.grandeur,
          value: value,
        });
        count++;
      }
    }
    console.log(`✓ Capteur Déchets: ${count} mesures (${wasteData.length} types)`);

    console.log("\n[MESURES] ✅ Insertion complétée avec succès!");
    console.log("[MESURES] Total: 5 capteurs × 3-5 types de mesures × 8 valeurs = ~136 mesures");
  } catch (error) {
    console.error("[MESURES] ❌ Erreur lors de l'insertion:", error);
    process.exit(1);
  }
}

insertMeasuresData();

import mysql from 'mysql2/promise';

async function insertAllMeasures() {
  let connection;
  try {
    console.log('🔄 Connexion à la base de données...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sousse_smart_city_projet_module'
    });

    console.log('✅ Connecté!\n');

    // Les UUIDs des capteurs (à adapter selon ta base)
    const energySensorId = '9a5e219f-3636-4ca8-bea3-b5f31b76645b';
    const trafficSensorId = '56c39c21-451d-4a57-ba70-24700e8c246e';
    const lightingSensorId = '7aff9bb8-1f83-4798-8380-8717d9dfdd1d';
    const airSensorId = '376e6436-0d6a-4334-ba01-276867685e48';
    const wasteSensorId = 'a20c9983-d335-4785-99c5-990f16e0f9df';

    // 1. ÉNERGIE - Courant
    console.log('📝 Insertion Courant (Énergie)...');
    const courant = [18.5, 21.2, 15.8, 19.3, 22.1, 23.5, 17.2, 20.3];
    for (const val of courant) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Courant', val, energySensorId]
      );
    }
    console.log('✅ Courant inséré');

    // 2. ÉNERGIE - Tension
    console.log('📝 Insertion Tension (Énergie)...');
    const tension = [230.5, 229.8, 231.2, 230.1, 229.5, 230.8, 231.1, 230.2];
    for (const val of tension) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Tension', val, energySensorId]
      );
    }
    console.log('✅ Tension inséré');

    // 3. ÉNERGIE - Consommation Énergie
    console.log('📝 Insertion Consommation Énergie...');
    const consommation = [125.5, 142.8, 98.2, 115.3, 138.9, 152.2, 105.6, 128.1];
    for (const val of consommation) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Consommation Énergie', val, energySensorId]
      );
    }
    console.log('✅ Consommation Énergie inséré');

    // 4. TRAFIC - Densité Trafic
    console.log('📝 Insertion Densité Trafic...');
    const densite = [45.2, 62.8, 38.5, 55.3, 68.9, 75.2, 42.6, 51.1];
    for (const val of densite) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Densité Trafic', val, trafficSensorId]
      );
    }
    console.log('✅ Densité Trafic inséré');

    // 5. TRAFIC - Vitesse Moyenne
    console.log('📝 Insertion Vitesse Moyenne...');
    const vitesse = [35.5, 28.3, 42.1, 31.7, 25.2, 22.8, 38.4, 33.6];
    for (const val of vitesse) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Vitesse Moyenne', val, trafficSensorId]
      );
    }
    console.log('✅ Vitesse Moyenne inséré');

    // 6. TRAFIC - Congestion
    console.log('📝 Insertion Congestion...');
    const congestion = [35.2, 52.8, 28.5, 45.3, 58.9, 65.2, 32.6, 41.1];
    for (const val of congestion) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Congestion', val, trafficSensorId]
      );
    }
    console.log('✅ Congestion inséré');

    // 7. ÉCLAIRAGE - Luminosité
    console.log('📝 Insertion Luminosité...');
    const luminosite = [450.5, 520.8, 380.2, 410.3, 490.9, 550.2, 390.6, 440.1];
    for (const val of luminosite) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Luminosité', val, lightingSensorId]
      );
    }
    console.log('✅ Luminosité inséré');

    // 8. ÉCLAIRAGE - Consommation
    console.log('📝 Insertion Consommation (Éclairage)...');
    const consommationEclairage = [85.3, 95.2, 72.5, 80.8, 88.6, 92.1, 75.9, 82.2];
    for (const val of consommationEclairage) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Consommation', val, lightingSensorId]
      );
    }
    console.log('✅ Consommation (Éclairage) inséré');

    // 9. AIR - CO2
    console.log('📝 Insertion CO2...');
    const co2 = [425.3, 418.7, 431.2, 422.1, 428.5, 435.2, 420.9, 433.7];
    for (const val of co2) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['CO2', val, airSensorId]
      );
    }
    console.log('✅ CO2 inséré');

    // 10. AIR - Température
    console.log('📝 Insertion Température...');
    const temperature = [22.5, 21.8, 23.2, 24.1, 23.5, 22.1, 21.5, 23.8];
    for (const val of temperature) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Température', val, airSensorId]
      );
    }
    console.log('✅ Température inséré');

    // 11. DÉCHETS - Niveau Remplissage
    console.log('📝 Insertion Niveau Remplissage...');
    const niveau = [45.2, 52.8, 38.5, 48.3, 55.9, 62.2, 41.6, 50.1];
    for (const val of niveau) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Niveau Remplissage', val, wasteSensorId]
      );
    }
    console.log('✅ Niveau Remplissage inséré');

    // 12. DÉCHETS - Collectes Jour
    console.log('📝 Insertion Collectes Jour...');
    const collectes = [3, 4, 2, 3, 5, 4, 2, 3];
    for (const val of collectes) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Collectes Jour', val, wasteSensorId]
      );
    }
    console.log('✅ Collectes Jour inséré');

    // 13. DÉCHETS - Poids Estimé
    console.log('📝 Insertion Poids Estimé...');
    const poids = [185.5, 215.8, 155.2, 195.3, 225.9, 252.2, 165.6, 200.1];
    for (const val of poids) {
      await connection.execute(
        'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
        ['Poids Estimé', val, wasteSensorId]
      );
    }
    console.log('✅ Poids Estimé inséré');

    console.log('\n✨ ✨ ✨ TOUTES LES MESURES ONT ÉTÉ INSÉRÉES AVEC SUCCÈS! ✨ ✨ ✨\n');
    console.log('Rafraîchis phpMyAdmin (F5) pour voir les nouvelles données!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

insertAllMeasures();

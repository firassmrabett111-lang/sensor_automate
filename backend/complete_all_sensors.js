import mysql from 'mysql2/promise';

async function completeMeasuresForAllSensors() {
  let connection;
  try {
    console.log('🔄 Connexion à la base de données...\n');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sousse_smart_city_projet_module'
    });

    console.log('✅ Connecté!\n');

    // 1. Récupérer TOUS les capteurs
    console.log('📋 Récupération de tous les capteurs...\n');
    const [sensors] = await connection.execute('SELECT UUID, Type FROM Capteur');
    
    console.log(`📊 ${sensors.length} capteurs trouvés:\n`);
    sensors.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.Type.padEnd(20)} | UUID: ${s.UUID}`);
    });

    // 2. Vérifier lesquels ont des mesures
    console.log('\n🔍 Vérification des mesures par capteur...\n');
    
    for (const sensor of sensors) {
      const [measurements] = await connection.execute(
        'SELECT COUNT(*) as count FROM Mesures1 WHERE UUID = ?',
        [sensor.UUID]
      );
      const count = measurements[0].count;
      const status = count > 0 ? '✅' : '❌';
      console.log(`  ${status} ${sensor.Type.padEnd(20)} - ${count} mesures`);
    }

    // 3. Insérer les données manquantes
    console.log('\n🔧 Insertion des données manquantes...\n');

    // Données génériques par type de capteur
    const sensorsData = {
      'Qualité de l\'air': [
        { nom: 'PM2.5', valeurs: [29.16, 35.42, 28.50, 32.18, 38.75, 41.20, 26.80, 33.90] },
        { nom: 'PM10', valeurs: [45.23, 52.18, 42.80, 48.50, 58.30, 62.10, 40.50, 51.20] },
        { nom: 'NO2', valeurs: [28.50, 32.18, 25.80, 29.50, 35.20, 38.60, 23.40, 30.80] },
        { nom: 'CO2', valeurs: [425.3, 418.7, 431.2, 422.1, 428.5, 435.2, 420.9, 433.7] },
        { nom: 'Température', valeurs: [22.5, 21.8, 23.2, 24.1, 23.5, 22.1, 21.5, 23.8] }
      ],
      'Énergie': [
        { nom: 'Consommation Énergie', valeurs: [125.5, 142.8, 98.2, 115.3, 138.9, 152.2, 105.6, 128.1] },
        { nom: 'Tension', valeurs: [230.5, 229.8, 231.2, 230.1, 229.5, 230.8, 231.1, 230.2] },
        { nom: 'Courant', valeurs: [18.5, 21.2, 15.8, 19.3, 22.1, 23.5, 17.2, 20.3] }
      ],
      'Trafic': [
        { nom: 'Densité Trafic', valeurs: [45.2, 62.8, 38.5, 55.3, 68.9, 75.2, 42.6, 51.1] },
        { nom: 'Vitesse Moyenne', valeurs: [35.5, 28.3, 42.1, 31.7, 25.2, 22.8, 38.4, 33.6] },
        { nom: 'Congestion', valeurs: [35.2, 52.8, 28.5, 45.3, 58.9, 65.2, 32.6, 41.1] }
      ],
      'Éclairage': [
        { nom: 'Luminosité', valeurs: [450.5, 520.8, 380.2, 410.3, 490.9, 550.2, 390.6, 440.1] },
        { nom: 'Consommation', valeurs: [85.3, 95.2, 72.5, 80.8, 88.6, 92.1, 75.9, 82.2] },
        { nom: 'État Ampoule', valeurs: [0, 0, 0, 0, 0, 0, 0, 0] }
      ],
      'Déchets': [
        { nom: 'Niveau Remplissage', valeurs: [45.2, 52.8, 38.5, 48.3, 55.9, 62.2, 41.6, 50.1] },
        { nom: 'Collectes Jour', valeurs: [3, 4, 2, 3, 5, 4, 2, 3] },
        { nom: 'Poids Estimé', valeurs: [185.5, 215.8, 155.2, 195.3, 225.9, 252.2, 165.6, 200.1] }
      ]
    };

    // Parcourir tous les capteurs et insérer les données manquantes
    for (const sensor of sensors) {
      const [measurements] = await connection.execute(
        'SELECT COUNT(*) as count FROM Mesures1 WHERE UUID = ?',
        [sensor.UUID]
      );

      if (measurements[0].count === 0) {
        console.log(`📝 Insertion données pour: ${sensor.Type}`);
        
        const data = sensorsData[sensor.Type];
        if (data) {
          for (const type of data) {
            for (const val of type.valeurs) {
              await connection.execute(
                'INSERT INTO Mesures1 (NomGrandeur, Valeur, UUID) VALUES (?, ?, ?)',
                [type.nom, val, sensor.UUID]
              );
            }
          }
          console.log(`   ✅ ${sensor.Type} complété`);
        } else {
          console.log(`   ⚠️ Type inconnu: ${sensor.Type}`);
        }
      } else {
        console.log(`✅ ${sensor.Type} déjà complet (${measurements[0].count} mesures)`);
      }
    }

    console.log('\n✨ ✨ ✨ TOUTES LES DONNÉES SONT MAINTENANT COMPLÈTES! ✨ ✨ ✨\n');
    console.log('📊 Résumé final:\n');
    
    for (const sensor of sensors) {
      const [measurements] = await connection.execute(
        'SELECT COUNT(DISTINCT NomGrandeur) as types_count, COUNT(*) as total FROM Mesures1 WHERE UUID = ?',
        [sensor.UUID]
      );
      const info = measurements[0];
      console.log(`  ✅ ${sensor.Type.padEnd(20)} - ${info.types_count} types, ${info.total} mesures total`);
    }
    
    console.log('\n🎉 Rafraîchis l\'application pour voir tous les graphiques!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

completeMeasuresForAllSensors();

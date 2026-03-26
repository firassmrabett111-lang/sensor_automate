#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🧹 Purge du cache et rebuild complet\n');

try {
  // 1. Nettoyer les caches
  console.log('1️⃣ Suppression des fichiers compilés...');
  const dirsToClean = [
    'dist',
    '.next',
    'node_modules/.vite',
    'node_modules/.esbuild'
  ];

  dirsToClean.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`   ✅ ${dir} supprimé`);
    }
  });

  // 2. Message final
  console.log('\n✨ Purge complète!\n');
  console.log('📝 Prochaines étapes:');
  console.log('   1. Redémarrez le serveur: npm run dev');
  console.log('   2. Rafraîchissez le navigateur: Ctrl+F5');
  console.log('   3. Les numéros des techniciens devraient maintenant s\'afficher!\n');

} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}

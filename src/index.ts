// ============================================================================
// SISTER SPACE — Démarrage du serveur
// ============================================================================

import app from './app';
import { lancerMigration } from './config/migrate';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const demarrer = async () => {
  // Lancer la migration au démarrage (ne fait rien si tables existent déjà)
  await lancerMigration();

  app.listen(PORT, () => {
    console.log('');
    console.log('🌸 ========================================');
    console.log(`🚀 Serveur Sister Space démarré !`);
    console.log(`🌐 URL : http://localhost:${PORT}`);
    console.log('🌸 ========================================');
    console.log('');
  });
};

demarrer();
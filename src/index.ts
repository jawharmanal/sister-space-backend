// ============================================================================
// SISTER SPACE — Démarrage du serveur
// ============================================================================

import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('');
  console.log('🌸 ========================================');
  console.log(`🚀 Serveur Sister Space démarré !`);
  console.log(`🌐 URL : http://localhost:${PORT}`);
  console.log('🌸 ========================================');
  console.log('');
});
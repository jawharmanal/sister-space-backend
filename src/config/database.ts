// ============================================================================
// SISTER SPACE — Configuration de la connexion à PostgreSQL
// ============================================================================

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Créer un "pool" de connexions
// Un pool = plusieurs connexions réutilisables (plus performant qu'une seule)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Tester la connexion au démarrage
pool.connect()
  .then((client) => {
    console.log('✅ Connecté à PostgreSQL avec succès !');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à PostgreSQL :', err.message);
  });

// Exporter le pool pour qu'il soit utilisable partout dans l'app
export default pool;
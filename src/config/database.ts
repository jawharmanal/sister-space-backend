// ============================================================================
// SISTER SPACE — Configuration de la connexion à PostgreSQL
// ============================================================================
// Compatible avec :
//   - Local : utilise DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD du .env
//   - Production (Railway/Vercel) : utilise DATABASE_URL si elle existe
// ============================================================================

import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuration : si DATABASE_URL existe, on l'utilise (Railway, Heroku, etc.)
// Sinon, on utilise les variables séparées (développement local)
let poolConfig: PoolConfig;

if (process.env.DATABASE_URL) {
  // Production
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Nécessaire pour Railway
    },
  };
} else {
  // Développement local
  poolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
}

const pool = new Pool(poolConfig);

// Tester la connexion au démarrage
pool.connect()
  .then((client) => {
    console.log('✅ Connecté à PostgreSQL avec succès !');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à PostgreSQL :', err.message);
  });

export default pool;
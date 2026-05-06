// ============================================================================
// SISTER SPACE — Migration BDD au démarrage
// ============================================================================
// Exécute le schéma + seed si la BDD est vide
// ============================================================================

import fs from 'fs';
import path from 'path';
import pool from './database';

export const lancerMigration = async () => {
  try {
    // Vérifier si la table Utilisatrice existe déjà
    const tableExiste = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'utilisatrice'
      )
    `);

    if (tableExiste.rows[0].exists) {
      console.log('ℹ️  Tables déjà présentes, migration ignorée.');
      return;
    }

    console.log('🚀 Migration de la BDD en cours...');

    // 1. Exécuter le script de création
    const schemaPath = path.join(__dirname, '..', 'sql', 'creation.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
      console.log('✅ Schéma créé (12 tables)');
    } else {
      console.warn('⚠️  Fichier creation.sql introuvable');
      return;
    }

    // 2. Exécuter le seed
    const seedPath = path.join(__dirname, '..', 'sql', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('✅ Données de test insérées');
    }

    console.log('🎉 Migration terminée avec succès !');

  } catch (error: any) {
    console.error('❌ Erreur de migration :', error.message);
  }
};
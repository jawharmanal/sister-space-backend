// ============================================================================
// SISTER SPACE — Service Admin
// ============================================================================
// Logique métier pour la modération (validation comptes, gestion utilisatrices)
// ============================================================================

import pool from '../config/database';

// ----------------------------------------------------------------------------
// Lister les inscriptions en attente de validation
// ----------------------------------------------------------------------------
export const listerInscriptionsEnAttente = async () => {
  const resultat = await pool.query(`
    SELECT 
      u.id,
      u.email,
      u.prenom,
      u.pseudo,
      u.date_naissance,
      u.bio,
      u.date_creation,
      v.nom AS ville
    FROM Utilisatrice u
    JOIN Ville v ON u.id_ville = v.id
    WHERE u.statut = 'EN_ATTENTE'
    ORDER BY u.date_creation ASC
  `);
  return resultat.rows;
};

// ----------------------------------------------------------------------------
// Lister toutes les utilisatrices (pour le dashboard admin)
// ----------------------------------------------------------------------------
export const listerToutesUtilisatrices = async () => {
  const resultat = await pool.query(`
    SELECT 
      u.id,
      u.email,
      u.prenom,
      u.pseudo,
      u.statut,
      u.role,
      u.date_creation,
      u.date_validation,
      v.nom AS ville
    FROM Utilisatrice u
    JOIN Ville v ON u.id_ville = v.id
    ORDER BY u.date_creation DESC
  `);
  return resultat.rows;
};

// ----------------------------------------------------------------------------
// Valider un compte EN_ATTENTE
// ----------------------------------------------------------------------------
export const validerCompte = async (id_utilisatrice: number) => {
  // Vérifier que l'utilisatrice existe et est en attente
  const utilisatrice = await pool.query(
    'SELECT id, statut FROM Utilisatrice WHERE id = $1',
    [id_utilisatrice]
  );

  if (utilisatrice.rows.length === 0) {
    throw new Error('UTILISATRICE_INTROUVABLE');
  }

  if (utilisatrice.rows[0].statut !== 'EN_ATTENTE') {
    throw new Error('COMPTE_PAS_EN_ATTENTE');
  }

  // Mettre à jour le statut
  const resultat = await pool.query(`
    UPDATE Utilisatrice
    SET statut = 'ACTIF', date_validation = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, email, prenom, pseudo, statut, date_validation
  `, [id_utilisatrice]);

  return resultat.rows[0];
};

// ----------------------------------------------------------------------------
// Refuser un compte EN_ATTENTE
// ----------------------------------------------------------------------------
export const refuserCompte = async (id_utilisatrice: number, motif: string) => {
  const utilisatrice = await pool.query(
    'SELECT id, statut FROM Utilisatrice WHERE id = $1',
    [id_utilisatrice]
  );

  if (utilisatrice.rows.length === 0) {
    throw new Error('UTILISATRICE_INTROUVABLE');
  }

  if (utilisatrice.rows[0].statut !== 'EN_ATTENTE') {
    throw new Error('COMPTE_PAS_EN_ATTENTE');
  }

  if (!motif || motif.trim().length === 0) {
    throw new Error('MOTIF_REQUIS');
  }

  const resultat = await pool.query(`
    UPDATE Utilisatrice
    SET statut = 'REFUSE', motif_refus = $2, date_validation = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, email, prenom, pseudo, statut, motif_refus
  `, [id_utilisatrice, motif]);

  return resultat.rows[0];
};
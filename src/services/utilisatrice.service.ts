// ============================================================================
// SISTER SPACE — Service Utilisatrice
// ============================================================================
// Logique métier pour la gestion du profil utilisatrice :
//   - Lister les utilisatrices actives
//   - Lister les comptes en attente (admin)
//   - Modifier son profil
//   - Changer son mot de passe (avec vérification ancien)
//   - Supprimer son compte (droit à l'oubli RGPD)
// ============================================================================

import bcrypt from 'bcrypt';
import pool from '../config/database';

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

export interface DonneesModificationProfil {
  prenom?: string;
  pseudo?: string;
  bio?: string;
  photo_url?: string;
}

export interface DonneesChangementMotDePasse {
  ancien_mot_de_passe: string;
  nouveau_mot_de_passe: string;
}

// ----------------------------------------------------------------------------
// LISTER TOUTES LES UTILISATRICES ACTIVES
// ----------------------------------------------------------------------------

export const listerUtilisatricesActives = async () => {
  const result = await pool.query(`
    SELECT 
      id, 
      prenom, 
      pseudo, 
      bio, 
      photo_url,
      statut, 
      role,
      date_creation
    FROM Utilisatrice
    WHERE statut = 'ACTIF'
    ORDER BY date_creation DESC
  `);
  return result.rows;
};

// ----------------------------------------------------------------------------
// LISTER LES COMPTES EN ATTENTE
// ----------------------------------------------------------------------------

export const listerComptesEnAttente = async () => {
  const result = await pool.query(`
    SELECT id, prenom, pseudo, bio, photo_url, date_creation
    FROM Utilisatrice
    WHERE statut = 'EN_ATTENTE'
    ORDER BY date_creation DESC
  `);
  return result.rows;
};

// ----------------------------------------------------------------------------
// MODIFIER LE PROFIL
// ----------------------------------------------------------------------------

export const modifierProfil = async (
  id_utilisatrice: number,
  donnees: DonneesModificationProfil
) => {
  const { prenom, pseudo, bio, photo_url } = donnees;

  // -------- Si on change le pseudo, vérifier qu'il n'est pas déjà pris --------
  if (pseudo) {
    const pseudoExiste = await pool.query(
      'SELECT id FROM Utilisatrice WHERE pseudo = $1 AND id != $2',
      [pseudo, id_utilisatrice]
    );
    if (pseudoExiste.rows.length > 0) {
      throw new Error('PSEUDO_DEJA_UTILISE');
    }
  }

  // -------- Construire la requête dynamique (seulement les champs fournis) --------
  const champsAModifier: string[] = [];
  const valeurs: any[] = [];
  let index = 1;

  if (prenom !== undefined) {
    champsAModifier.push(`prenom = $${index++}`);
    valeurs.push(prenom);
  }
  if (pseudo !== undefined) {
    champsAModifier.push(`pseudo = $${index++}`);
    valeurs.push(pseudo);
  }
  if (bio !== undefined) {
    champsAModifier.push(`bio = $${index++}`);
    valeurs.push(bio);
  }
  if (photo_url !== undefined) {
    champsAModifier.push(`photo_url = $${index++}`);
    valeurs.push(photo_url);
  }

  if (champsAModifier.length === 0) {
    throw new Error('AUCUN_CHAMP_A_MODIFIER');
  }

  // -------- Ajouter l'ID en dernier pour le WHERE --------
  valeurs.push(id_utilisatrice);

  const requete = `
    UPDATE Utilisatrice 
    SET ${champsAModifier.join(', ')}
    WHERE id = $${index}
    RETURNING id, email, prenom, pseudo, bio, photo_url, statut, role
  `;

  const result = await pool.query(requete, valeurs);
  return result.rows[0];
};

// ----------------------------------------------------------------------------
// CHANGER LE MOT DE PASSE
// ----------------------------------------------------------------------------

export const changerMotDePasse = async (
  id_utilisatrice: number,
  donnees: DonneesChangementMotDePasse
) => {
  const { ancien_mot_de_passe, nouveau_mot_de_passe } = donnees;

  // -------- 1. Récupérer le hash actuel --------
  const result = await pool.query(
    'SELECT mot_de_passe_hash FROM Utilisatrice WHERE id = $1',
    [id_utilisatrice]
  );

  if (result.rows.length === 0) {
    throw new Error('UTILISATRICE_INTROUVABLE');
  }

  // -------- 2. Vérifier l'ancien mot de passe --------
  const ancienValide = await bcrypt.compare(
    ancien_mot_de_passe,
    result.rows[0].mot_de_passe_hash
  );
  if (!ancienValide) {
    throw new Error('ANCIEN_MOT_DE_PASSE_INCORRECT');
  }

  // -------- 3. Hacher le nouveau mot de passe (12 rounds, ANSSI) --------
  const nouveau_hash = await bcrypt.hash(nouveau_mot_de_passe, 12);

  // -------- 4. Mettre à jour --------
  await pool.query(
    'UPDATE Utilisatrice SET mot_de_passe_hash = $1 WHERE id = $2',
    [nouveau_hash, id_utilisatrice]
  );

  return { success: true };
};

// ----------------------------------------------------------------------------
// SUPPRIMER LE COMPTE (DROIT À L'OUBLI RGPD)
// ----------------------------------------------------------------------------

export const supprimerCompte = async (
  id_utilisatrice: number,
  mot_de_passe: string
) => {
  // -------- 1. Vérifier le mot de passe pour confirmation --------
  const result = await pool.query(
    'SELECT mot_de_passe_hash FROM Utilisatrice WHERE id = $1',
    [id_utilisatrice]
  );

  if (result.rows.length === 0) {
    throw new Error('UTILISATRICE_INTROUVABLE');
  }

  const motDePasseValide = await bcrypt.compare(
    mot_de_passe,
    result.rows[0].mot_de_passe_hash
  );
  if (!motDePasseValide) {
    throw new Error('MOT_DE_PASSE_INCORRECT');
  }

  // -------- 2. Supprimer le compte (CASCADE supprime aussi posts/likes/messages/etc.) --------
  await pool.query('DELETE FROM Utilisatrice WHERE id = $1', [id_utilisatrice]);

  return { success: true };
};
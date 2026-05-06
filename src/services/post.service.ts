// ============================================================================
// SISTER SPACE — Service Posts
// ============================================================================
// Logique métier pour la gestion des posts (publications du fil)
// ============================================================================

import pool from '../config/database';

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

export interface DonneesPost {
  contenu: string;
  photos_urls?: string[];
  id_auteure: number;
}


// ----------------------------------------------------------------------------
// Lister les posts du fil (avec filtre optionnel par centre d'intérêt)
// ----------------------------------------------------------------------------
export const listerPosts = async (id_centre_interet?: number) => {
  // Si un filtre est demandé, on ajoute une condition WHERE sur les centres d'intérêt
  const filtreCondition = id_centre_interet
    ? `AND p.id_auteure IN (
        SELECT id_utilisatrice FROM Utilisatrice_CentreInteret 
        WHERE id_centre_interet = $1
      )`
    : '';
  
  const params = id_centre_interet ? [id_centre_interet] : [];

  const resultat = await pool.query(`
    SELECT 
      p.id,
      p.contenu,
      p.photos_urls,
      p.date_creation,
      u.id AS id_auteure,
      u.prenom AS auteure_prenom,
      u.pseudo AS auteure_pseudo,
      (SELECT COUNT(*) FROM Likes WHERE id_post = p.id) AS nb_likes,
      (SELECT COUNT(*) FROM Commentaire WHERE id_post = p.id) AS nb_commentaires
    FROM Post p
    JOIN Utilisatrice u ON p.id_auteure = u.id
    WHERE p.est_supprime = FALSE
    ${filtreCondition}
    ORDER BY p.date_creation DESC
    LIMIT 50
  `, params);
  
  return resultat.rows;
};

// ----------------------------------------------------------------------------
// Récupérer un post précis avec ses commentaires
// ----------------------------------------------------------------------------
export const recupererPost = async (id_post: number) => {
  // 1. Récupérer le post
  const postResult = await pool.query(`
    SELECT 
      p.id, p.contenu, p.photos_urls, p.date_creation,
      u.id AS id_auteure, u.prenom AS auteure_prenom, u.pseudo AS auteure_pseudo,
      (SELECT COUNT(*) FROM Likes WHERE id_post = p.id) AS nb_likes
    FROM Post p
    JOIN Utilisatrice u ON p.id_auteure = u.id
    WHERE p.id = $1 AND p.est_supprime = FALSE
  `, [id_post]);

  if (postResult.rows.length === 0) {
    throw new Error('POST_INTROUVABLE');
  }

  const post = postResult.rows[0];

  // 2. Récupérer les commentaires
  const commentairesResult = await pool.query(`
    SELECT 
      c.id, c.contenu, c.date_creation,
      u.id AS id_auteure, u.prenom AS auteure_prenom, u.pseudo AS auteure_pseudo
    FROM Commentaire c
    JOIN Utilisatrice u ON c.id_auteure = u.id
    WHERE c.id_post = $1
    ORDER BY c.date_creation ASC
  `, [id_post]);

  return {
    ...post,
    commentaires: commentairesResult.rows,
  };
};

// ----------------------------------------------------------------------------
// Créer un nouveau post
// ----------------------------------------------------------------------------
export const creerPost = async (donnees: DonneesPost) => {
  const { contenu, photos_urls, id_auteure } = donnees;

  // Validation : contenu ne doit pas dépasser 500 caractères (RM-05)
  if (contenu.length > 500) {
    throw new Error('CONTENU_TROP_LONG');
  }

  // Validation : max 4 photos (RM-05)
  if (photos_urls && photos_urls.length > 4) {
    throw new Error('TROP_DE_PHOTOS');
  }

  const photosJson = photos_urls && photos_urls.length > 0 
    ? JSON.stringify(photos_urls) 
    : null;

  const resultat = await pool.query(`
    INSERT INTO Post (id_auteure, contenu, photos_urls)
    VALUES ($1, $2, $3)
    RETURNING id, contenu, photos_urls, date_creation
  `, [id_auteure, contenu, photosJson]);

  return resultat.rows[0];
};

// ----------------------------------------------------------------------------
// Liker un post
// ----------------------------------------------------------------------------
export const likerPost = async (id_post: number, id_utilisatrice: number) => {
  // Vérifier que le post existe
  const postExiste = await pool.query(
    'SELECT id FROM Post WHERE id = $1 AND est_supprime = FALSE',
    [id_post]
  );
  if (postExiste.rows.length === 0) {
    throw new Error('POST_INTROUVABLE');
  }

  // Tenter d'insérer le like (la contrainte UNIQUE empêche les doublons)
  try {
    await pool.query(
      'INSERT INTO Likes (id_post, id_utilisatrice) VALUES ($1, $2)',
      [id_post, id_utilisatrice]
    );
    return { liked: true };
  } catch (error: any) {
    // Si erreur de contrainte unique = déjà liké
    if (error.code === '23505') {
      throw new Error('DEJA_LIKE');
    }
    throw error;
  }
};

// ----------------------------------------------------------------------------
// Retirer son like d'un post
// ----------------------------------------------------------------------------
export const unlikePost = async (id_post: number, id_utilisatrice: number) => {
  const resultat = await pool.query(
    'DELETE FROM Likes WHERE id_post = $1 AND id_utilisatrice = $2',
    [id_post, id_utilisatrice]
  );
  
  if (resultat.rowCount === 0) {
    throw new Error('LIKE_INTROUVABLE');
  }

  return { liked: false };
};
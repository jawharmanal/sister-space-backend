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

// Mots-clés associés à chaque catégorie pour le filtrage
const MOTS_CLES_CATEGORIES: Record<number, string[]> = {
  1: ['resto', 'restaurant', 'café', 'cafe', 'brunch', 'cuisine', 'food', 'plat', 'manger'],     // Restos
  2: ['film', 'cinéma', 'cinema', 'série', 'serie', 'netflix', 'movie'],                         // Cinéma
  3: ['shopping', 'mode', 'vêtement', 'vetement', 'soldes', 'achat', 'pépite', 'pepite'],        // Shopping
  4: ['expo', 'musée', 'musee', 'art', 'théâtre', 'theatre', 'galerie', 'culture'],              // Culture
  5: ['sport', 'course', 'running', 'gym', 'yoga', 'marathon', 'fitness', 'run', 'cours'],       // Sport
  6: ['bien-être', 'bien etre', 'méditation', 'meditation', 'self-care', 'mindfulness', 'zen'],  // Bien-être
  7: ['musique', 'music', 'concert', 'festival', 'playlist', 'chanson'],                          // Musique
  8: ['voyage', 'trip', 'lisbon', 'paris', 'road trip', 'destination', 'travel', 'vacances'],   // Voyages
};

export const listerPosts = async (id_centre_interet?: number) => {
  // Si un filtre est demandé, on filtre par mots-clés dans le contenu
  let filtreCondition = '';
  let params: any[] = [];

  if (id_centre_interet && MOTS_CLES_CATEGORIES[id_centre_interet]) {
    const motsCles = MOTS_CLES_CATEGORIES[id_centre_interet];
    
    // Construire une condition WHERE avec ILIKE pour chaque mot-clé (insensible à la casse)
    const conditions = motsCles.map((_, index) => `LOWER(p.contenu) LIKE $${index + 1}`).join(' OR ');
    filtreCondition = `AND (${conditions})`;
    
    // Paramètres : chaque mot-clé entouré de % pour LIKE
    params = motsCles.map(mot => `%${mot.toLowerCase()}%`);
  }

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

// ----------------------------------------------------------------------------
// Créer un commentaire sur un post
// ----------------------------------------------------------------------------
export const creerCommentaire = async (id_post: number, id_auteure: number, contenu: string) => {
  // Validation : le contenu ne doit pas être vide
  if (!contenu || contenu.trim().length === 0) {
    throw new Error('CONTENU_VIDE');
  }

  // Validation : max 500 caractères (RM-07)
  if (contenu.length > 500) {
    throw new Error('CONTENU_TROP_LONG');
  }

  // Vérifier que le post existe
  const postExiste = await pool.query(
    'SELECT id FROM Post WHERE id = $1 AND est_supprime = FALSE',
    [id_post]
  );
  if (postExiste.rows.length === 0) {
    throw new Error('POST_INTROUVABLE');
  }

  // Créer le commentaire
  const resultat = await pool.query(`
    INSERT INTO Commentaire (id_post, id_auteure, contenu)
    VALUES ($1, $2, $3)
    RETURNING id, contenu, date_creation, id_auteure
  `, [id_post, id_auteure, contenu]);

  // Récupérer aussi les infos de l'auteure pour l'affichage
  const commentaire = resultat.rows[0];
  const auteureResult = await pool.query(
    'SELECT prenom, pseudo FROM Utilisatrice WHERE id = $1',
    [id_auteure]
  );

  return {
    ...commentaire,
    auteure_prenom: auteureResult.rows[0].prenom,
    auteure_pseudo: auteureResult.rows[0].pseudo,
  };
};
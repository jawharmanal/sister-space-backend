// ============================================================================
// SISTER SPACE — Service d'authentification
// ============================================================================
// Ce fichier contient toute la LOGIQUE MÉTIER de l'authentification :
//   - Hachage du mot de passe (bcrypt)
//   - Création d'une utilisatrice en BDD
//   - Connexion (vérification mot de passe)
// ============================================================================
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/database';

// ----------------------------------------------------------------------------
// TYPES — la "forme" des données qu'on manipule
// ----------------------------------------------------------------------------

export interface DonneesInscription {
  email: string;
  mot_de_passe: string;
  prenom: string;
  pseudo: string;
  date_naissance: string;
  id_ville: number;
  bio?: string;
  centres_interet: number[];
}

// ----------------------------------------------------------------------------
// FONCTION : Inscrire une nouvelle utilisatrice
// ----------------------------------------------------------------------------

export const inscrireUtilisatrice = async (donnees: DonneesInscription) => {
  const { email, mot_de_passe, prenom, pseudo, date_naissance, id_ville, bio, centres_interet } = donnees;

  // -------- 1. Vérifier que l'email n'existe pas déjà --------
  const emailExiste = await pool.query(
    'SELECT id FROM Utilisatrice WHERE email = $1',
    [email]
  );
  if (emailExiste.rows.length > 0) {
    throw new Error('EMAIL_DEJA_UTILISE');
  }

  // -------- 2. Vérifier que le pseudo n'existe pas déjà --------
  const pseudoExiste = await pool.query(
    'SELECT id FROM Utilisatrice WHERE pseudo = $1',
    [pseudo]
  );
  if (pseudoExiste.rows.length > 0) {
    throw new Error('PSEUDO_DEJA_UTILISE');
  }

  // -------- 3. Hacher le mot de passe (RM-02, ANSSI) --------
  const saltRounds = 12;
  const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, saltRounds);

  // -------- 4. Créer l'utilisatrice en BDD --------
  const resultat = await pool.query(
    `INSERT INTO Utilisatrice 
      (email, mot_de_passe_hash, prenom, pseudo, date_naissance, id_ville, bio, statut, role)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, 'ACTIF', 'UTILISATRICE')
    RETURNING id, email, prenom, pseudo, statut, date_creation`,
    [email, mot_de_passe_hash, prenom, pseudo, date_naissance, id_ville, bio || null]
  );

  const nouvelle_utilisatrice = resultat.rows[0];

  // -------- 5. Lier les centres d'intérêt (RM-11 : 3 à 5) --------
  if (centres_interet && centres_interet.length >= 3 && centres_interet.length <= 5) {
    for (const id_centre of centres_interet) {
      await pool.query(
        'INSERT INTO Utilisatrice_CentreInteret (id_utilisatrice, id_centre_interet) VALUES ($1, $2)',
        [nouvelle_utilisatrice.id, id_centre]
      );
    }
  }

  // -------- 6. Retourner les infos (sans le mot de passe !) --------
  return nouvelle_utilisatrice;
};

// ----------------------------------------------------------------------------
// FONCTION : Connexion d'une utilisatrice
// ----------------------------------------------------------------------------

export const connecterUtilisatrice = async (email: string, mot_de_passe: string) => {
  // 1. Récupérer l'utilisatrice par email
  const resultat = await pool.query(
    `SELECT id, email, mot_de_passe_hash, prenom, pseudo, statut, role 
     FROM Utilisatrice 
     WHERE email = $1`,
    [email]
  );

  if (resultat.rows.length === 0) {
    throw new Error('IDENTIFIANTS_INCORRECTS');
  }

  const utilisatrice = resultat.rows[0];

  // 2. Vérifier le mot de passe
  const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisatrice.mot_de_passe_hash);
  if (!motDePasseValide) {
    throw new Error('IDENTIFIANTS_INCORRECTS');
  }

  // 3. Vérifier que le compte est actif
  if (utilisatrice.statut !== 'ACTIF') {
    throw new Error(`COMPTE_${utilisatrice.statut}`);
  }

// 4. Générer le token JWT (valide 7 jours)
  const token = jwt.sign(
    {
      id: utilisatrice.id,
      email: utilisatrice.email,
      role: utilisatrice.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  // 5. Retourner les infos + le token (sans le hash du mot de passe !)
  return {
    token,
    utilisatrice: {
      id: utilisatrice.id,
      email: utilisatrice.email,
      prenom: utilisatrice.prenom,
      pseudo: utilisatrice.pseudo,
      statut: utilisatrice.statut,
      role: utilisatrice.role,
    },
  };
};
// ============================================================================
// SISTER SPACE — Contrôleur d'authentification
// ============================================================================
// Ce fichier reçoit les requêtes HTTP et appelle les services.
// Il ne contient PAS de logique métier (qui est dans les services).
// ============================================================================

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

// ----------------------------------------------------------------------------
// POST /api/auth/register — Inscription
// ----------------------------------------------------------------------------
export const register = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      mot_de_passe, 
      prenom, 
      pseudo, 
      date_naissance, 
      id_ville, 
      bio, 
      centres_interet,
      identification_femme,
      acceptation_cgu,
      consentement_donnees
    } = req.body;

    // -------- Validation des champs obligatoires --------
    if (!email || !mot_de_passe || !prenom || !pseudo || !date_naissance || !id_ville) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis',
      });
    }

    // -------- Validation des cases obligatoires (RGPD + RM-07) --------
    if (!identification_femme || !acceptation_cgu || !consentement_donnees) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez accepter toutes les conditions',
      });
    }

    // -------- Validation du mot de passe (RM-02) --------
    if (mot_de_passe.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      });
    }
    const regexMdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    if (!regexMdp.test(mot_de_passe)) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir maj/min/chiffre/caractère spécial',
      });
    }

    // -------- Validation des centres d'intérêt (RM-11 : 3 à 5) --------
    if (!centres_interet || centres_interet.length < 3 || centres_interet.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez choisir entre 3 et 5 centres d\'intérêt',
      });
    }

    // -------- Appel du service --------
    const utilisatrice = await authService.inscrireUtilisatrice({
      email,
      mot_de_passe,
      prenom,
      pseudo,
      date_naissance,
      id_ville,
      bio,
      centres_interet,
    });

    // -------- Réponse de succès --------
    return res.status(201).json({
      success: true,
      message: 'Inscription réussie ! Votre compte est en attente de validation.',
      data: utilisatrice,
    });

  } catch (error: any) {
    // -------- Gestion des erreurs métier --------
    if (error.message === 'EMAIL_DEJA_UTILISE') {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
    }
    if (error.message === 'PSEUDO_DEJA_UTILISE') {
      return res.status(409).json({
        success: false,
        message: 'Ce pseudo est déjà utilisé',
      });
    }

    // -------- Erreur serveur générique --------
    console.error('Erreur inscription :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur, veuillez réessayer',
    });
  }
};
// ----------------------------------------------------------------------------
// GET /api/auth/me — Récupérer les infos de l'utilisatrice connectée
// ----------------------------------------------------------------------------
export const moi = async (req: Request, res: Response) => {
  try {
    // req.utilisatrice est rempli par le middleware authentifier
    if (!req.utilisatrice) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifiée',
      });
    }

    return res.status(200).json({
      success: true,
      data: req.utilisatrice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};

// ----------------------------------------------------------------------------
// POST /api/auth/login — Connexion
// ----------------------------------------------------------------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    const resultat = await authService.connecterUtilisatrice(email, mot_de_passe);

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      data: {
        token: resultat.token,
        utilisatrice: resultat.utilisatrice,
      },
});

  } catch (error: any) {
    if (error.message === 'IDENTIFIANTS_INCORRECTS') {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }
    if (error.message.startsWith('COMPTE_')) {
      const statut = error.message.replace('COMPTE_', '');
      return res.status(403).json({
        success: false,
        message: `Votre compte est ${statut}`,
      });
    }

    console.error('Erreur connexion :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
  
};

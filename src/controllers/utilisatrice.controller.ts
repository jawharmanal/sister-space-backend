// ============================================================================
// SISTER SPACE — Contrôleur Utilisatrice
// ============================================================================

import { Request, Response } from 'express';
import * as utilisatriceService from '../services/utilisatrice.service';

// ----------------------------------------------------------------------------
// GET /api/utilisatrices — Liste des utilisatrices actives
// ----------------------------------------------------------------------------
export const lister = async (req: Request, res: Response) => {
  try {
    const utilisatrices = await utilisatriceService.listerUtilisatricesActives();
    return res.status(200).json({
      success: true,
      count: utilisatrices.length,
      data: utilisatrices,
    });
  } catch (error) {
    console.error('Erreur récupération utilisatrices :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// GET /api/utilisatrices/en-attente — Comptes en attente
// ----------------------------------------------------------------------------
export const listerEnAttente = async (req: Request, res: Response) => {
  try {
    const comptes = await utilisatriceService.listerComptesEnAttente();
    return res.status(200).json({
      success: true,
      count: comptes.length,
      data: comptes,
    });
  } catch (error) {
    console.error('Erreur :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// PUT /api/utilisatrices/moi — Modifier mon profil
// ----------------------------------------------------------------------------
export const modifierMonProfil = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const { prenom, pseudo, bio, photo_url } = req.body;

    // -------- Validations --------
    if (prenom !== undefined && (prenom.length < 2 || prenom.length > 50)) {
      return res.status(400).json({
        success: false,
        message: 'Le prénom doit faire entre 2 et 50 caractères',
      });
    }
    if (pseudo !== undefined && (pseudo.length < 3 || pseudo.length > 30)) {
      return res.status(400).json({
        success: false,
        message: 'Le pseudo doit faire entre 3 et 30 caractères',
      });
    }
    if (bio !== undefined && bio.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'La bio ne peut pas dépasser 300 caractères',
      });
    }

    // -------- Appel du service --------
    const utilisatriceModifiee = await utilisatriceService.modifierProfil(
      req.utilisatrice.id,
      { prenom, pseudo, bio, photo_url }
    );

    return res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès 🌸',
      data: utilisatriceModifiee,
    });
  } catch (error: any) {
    if (error.message === 'PSEUDO_DEJA_UTILISE') {
      return res.status(409).json({
        success: false,
        message: 'Ce pseudo est déjà utilisé',
      });
    }
    if (error.message === 'AUCUN_CHAMP_A_MODIFIER') {
      return res.status(400).json({
        success: false,
        message: 'Aucune modification à enregistrer',
      });
    }

    console.error('Erreur modification profil :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// PUT /api/utilisatrices/moi/mot-de-passe — Changer mon mot de passe
// ----------------------------------------------------------------------------
export const changerMonMotDePasse = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;

    // -------- Validations --------
    if (!ancien_mot_de_passe || !nouveau_mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Ancien et nouveau mot de passe requis',
      });
    }

    if (nouveau_mot_de_passe.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
      });
    }

    const regexMdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    if (!regexMdp.test(nouveau_mot_de_passe)) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir maj/min/chiffre/caractère spécial',
      });
    }

    if (ancien_mot_de_passe === nouveau_mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit être différent de l\'ancien',
      });
    }

    // -------- Appel du service --------
    await utilisatriceService.changerMotDePasse(req.utilisatrice.id, {
      ancien_mot_de_passe,
      nouveau_mot_de_passe,
    });

    return res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès 🔒',
    });
  } catch (error: any) {
    if (error.message === 'ANCIEN_MOT_DE_PASSE_INCORRECT') {
      return res.status(401).json({
        success: false,
        message: 'Ton ancien mot de passe est incorrect',
      });
    }
    if (error.message === 'UTILISATRICE_INTROUVABLE') {
      return res.status(404).json({
        success: false,
        message: 'Utilisatrice introuvable',
      });
    }

    console.error('Erreur changement mdp :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// DELETE /api/utilisatrices/moi — Supprimer mon compte (RGPD)
// ----------------------------------------------------------------------------
export const supprimerMonCompte = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const { mot_de_passe } = req.body;

    if (!mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe requis pour confirmer la suppression',
      });
    }

    await utilisatriceService.supprimerCompte(req.utilisatrice.id, mot_de_passe);

    return res.status(200).json({
      success: true,
      message: 'Compte supprimé avec succès. À bientôt 🌸',
    });
  } catch (error: any) {
    if (error.message === 'MOT_DE_PASSE_INCORRECT') {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect',
      });
    }
    if (error.message === 'UTILISATRICE_INTROUVABLE') {
      return res.status(404).json({
        success: false,
        message: 'Utilisatrice introuvable',
      });
    }

    console.error('Erreur suppression compte :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
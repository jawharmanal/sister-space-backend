// ============================================================================
// SISTER SPACE — Contrôleur Admin
// ============================================================================

import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';

// ----------------------------------------------------------------------------
// GET /api/admin/inscriptions-en-attente
// ----------------------------------------------------------------------------
export const listerInscriptionsEnAttente = async (req: Request, res: Response) => {
  try {
    const inscriptions = await adminService.listerInscriptionsEnAttente();
    return res.status(200).json({
      success: true,
      count: inscriptions.length,
      data: inscriptions,
    });
  } catch (error) {
    console.error('Erreur lister en attente :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// GET /api/admin/utilisatrices
// ----------------------------------------------------------------------------
export const listerToutesUtilisatrices = async (req: Request, res: Response) => {
  try {
    const utilisatrices = await adminService.listerToutesUtilisatrices();
    return res.status(200).json({
      success: true,
      count: utilisatrices.length,
      data: utilisatrices,
    });
  } catch (error) {
    console.error('Erreur lister utilisatrices :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// PATCH /api/admin/utilisatrices/:id/valider
// ----------------------------------------------------------------------------
export const validerCompte = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID invalide' });
    }

    const utilisatrice = await adminService.validerCompte(id);
    return res.status(200).json({
      success: true,
      message: `Compte de ${utilisatrice.prenom} validé ✅`,
      data: utilisatrice,
    });

  } catch (error: any) {
    if (error.message === 'UTILISATRICE_INTROUVABLE') {
      return res.status(404).json({ success: false, message: 'Utilisatrice introuvable' });
    }
    if (error.message === 'COMPTE_PAS_EN_ATTENTE') {
      return res.status(409).json({ success: false, message: 'Ce compte n\'est pas en attente de validation' });
    }
    console.error('Erreur valider compte :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// PATCH /api/admin/utilisatrices/:id/refuser
// ----------------------------------------------------------------------------
export const refuserCompte = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID invalide' });
    }

    const { motif } = req.body;

    const utilisatrice = await adminService.refuserCompte(id, motif);
    return res.status(200).json({
      success: true,
      message: `Compte de ${utilisatrice.prenom} refusé`,
      data: utilisatrice,
    });

  } catch (error: any) {
    if (error.message === 'UTILISATRICE_INTROUVABLE') {
      return res.status(404).json({ success: false, message: 'Utilisatrice introuvable' });
    }
    if (error.message === 'COMPTE_PAS_EN_ATTENTE') {
      return res.status(409).json({ success: false, message: 'Ce compte n\'est pas en attente' });
    }
    if (error.message === 'MOTIF_REQUIS') {
      return res.status(400).json({ success: false, message: 'Le motif de refus est obligatoire' });
    }
    console.error('Erreur refuser compte :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
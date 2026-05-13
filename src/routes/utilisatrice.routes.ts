// ============================================================================
// SISTER SPACE — Routes Utilisatrice
// ============================================================================

import { Router } from 'express';
import * as utilisatriceController from '../controllers/utilisatrice.controller';
import { authentifier } from '../middlewares/auth.middleware';

const router = Router();

// ----------------------------------------------------------------------------
// GET /api/utilisatrices — Liste des utilisatrices actives
// ----------------------------------------------------------------------------
router.get('/', authentifier, utilisatriceController.lister);

// ----------------------------------------------------------------------------
// GET /api/utilisatrices/en-attente — Comptes en attente (admin)
// ----------------------------------------------------------------------------
router.get('/en-attente', authentifier, utilisatriceController.listerEnAttente);

// ----------------------------------------------------------------------------
// PUT /api/utilisatrices/moi — Modifier mon profil
// ----------------------------------------------------------------------------
router.put('/moi', authentifier, utilisatriceController.modifierMonProfil);

// ----------------------------------------------------------------------------
// PUT /api/utilisatrices/moi/mot-de-passe — Changer mon mot de passe
// ----------------------------------------------------------------------------
router.put('/moi/mot-de-passe', authentifier, utilisatriceController.changerMonMotDePasse);

// ----------------------------------------------------------------------------
// DELETE /api/utilisatrices/moi — Supprimer mon compte (RGPD)
// ----------------------------------------------------------------------------
router.delete('/moi', authentifier, utilisatriceController.supprimerMonCompte);

export default router;
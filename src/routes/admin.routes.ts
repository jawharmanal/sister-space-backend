// ============================================================================
// SISTER SPACE — Routes Admin
// ============================================================================
// TOUTES ces routes sont doublement protégées :
//   1. authentifier → JWT valide requis
//   2. requireAdmin → rôle ADMIN obligatoire
// ============================================================================

import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authentifier, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Toutes les routes admin nécessitent JWT + rôle ADMIN
router.use(authentifier, requireAdmin);

// Lister les inscriptions en attente
router.get('/inscriptions-en-attente', adminController.listerInscriptionsEnAttente);

// Lister toutes les utilisatrices
router.get('/utilisatrices', adminController.listerToutesUtilisatrices);

// Valider un compte
router.patch('/utilisatrices/:id/valider', adminController.validerCompte);

// Refuser un compte
router.patch('/utilisatrices/:id/refuser', adminController.refuserCompte);

export default router;
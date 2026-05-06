// ============================================================================
// SISTER SPACE — Routes Utilisatrice
// ============================================================================

import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// ----------------------------------------------------------------------------
// GET /api/utilisatrices — Récupérer toutes les utilisatrices actives
// ----------------------------------------------------------------------------
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        prenom, 
        pseudo, 
        bio, 
        statut, 
        role,
        date_creation
      FROM Utilisatrice
      WHERE statut = 'ACTIF'
      ORDER BY date_creation DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisatrices :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
});

// ----------------------------------------------------------------------------
// GET /api/utilisatrices/en-attente — Comptes en attente de validation (admin)
// ----------------------------------------------------------------------------
router.get('/en-attente', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, prenom, pseudo, bio, date_creation
      FROM Utilisatrice
      WHERE statut = 'EN_ATTENTE'
      ORDER BY date_creation DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

export default router;
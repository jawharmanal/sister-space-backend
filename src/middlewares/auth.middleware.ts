// ============================================================================
// SISTER SPACE — Middleware d'authentification
// ============================================================================
// Ce middleware vérifie qu'une requête contient un JWT valide.
// Si oui : on ajoute les infos de l'utilisatrice à req et on laisse passer.
// Si non : on bloque avec un 401 Unauthorized.
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// On enrichit le type Request d'Express pour inclure "utilisatrice"
declare global {
  namespace Express {
    interface Request {
      utilisatrice?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

// ----------------------------------------------------------------------------
// Middleware : vérifier le JWT
// ----------------------------------------------------------------------------
export const authentifier = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant ou mal formaté',
      });
    }

    // 2. Extraire le token (après "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Vérifier le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
      role: string;
    };

    // 4. Ajouter les infos de l'utilisatrice à la requête
    req.utilisatrice = decoded;

    // 5. Laisser passer vers la suite (route ou autre middleware)
    next();

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré, veuillez vous reconnecter',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification du token',
    });
  }
};

// ----------------------------------------------------------------------------
// Middleware : vérifier le rôle ADMIN
// ----------------------------------------------------------------------------
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.utilisatrice || req.utilisatrice.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux administratrices',
    });
  }
  next();
};
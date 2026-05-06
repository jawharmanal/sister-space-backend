// ============================================================================
// SISTER SPACE — Routes d'authentification
// ============================================================================

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authentifier } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Inscription d'une nouvelle utilisatrice
 *     description: Crée un compte avec statut EN_ATTENTE de validation par l'admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, mot_de_passe, prenom, pseudo, date_naissance, id_ville, centres_interet, identification_femme, acceptation_cgu, consentement_donnees]
 *             properties:
 *               email: { type: string, example: "manal@email.com" }
 *               mot_de_passe: { type: string, example: "TestSister2026!", description: "Min 8 caractères, maj/min/chiffre/spécial" }
 *               prenom: { type: string, example: "Manal" }
 *               pseudo: { type: string, example: "@manal_dev" }
 *               date_naissance: { type: string, format: date, example: "1995-05-15" }
 *               id_ville: { type: integer, example: 1 }
 *               bio: { type: string, example: "Future développeuse 🌸" }
 *               centres_interet: { type: array, items: { type: integer }, example: [1, 4, 5] }
 *               identification_femme: { type: boolean, example: true }
 *               acceptation_cgu: { type: boolean, example: true }
 *               consentement_donnees: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Inscription réussie, compte en attente de validation
 *       400:
 *         description: Données invalides (mot de passe faible, CGU non acceptées, etc.)
 *         content: { application/json: { schema: { $ref: "#/components/schemas/ErreurReponse" } } }
 *       409:
 *         description: Email ou pseudo déjà utilisé
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion d'une utilisatrice
 *     description: Retourne un token JWT valide 7 jours et les infos utilisatrice.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, mot_de_passe]
 *             properties:
 *               email: { type: string, example: "emma.park@email.com" }
 *               mot_de_passe: { type: string, example: "Emma1234!" }
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Connexion réussie !" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string, example: "eyJhbGciOi..." }
 *                     utilisatrice: { $ref: "#/components/schemas/Utilisatrice" }
 *       401:
 *         description: Email ou mot de passe incorrect
 *       403:
 *         description: Compte non actif (EN_ATTENTE, REFUSE ou BANNI)
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Récupérer le profil de l'utilisatrice connectée
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisatrice
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/me', authentifier, authController.moi);

export default router;
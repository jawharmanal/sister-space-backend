// ============================================================================
// SISTER SPACE — Routes Posts
// ============================================================================

import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { authentifier } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Lister les posts du fil d'actualité
 *     description: Retourne les 50 derniers posts triés par date. Filtrage optionnel par centre d'intérêt.
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema: { type: integer }
 *         description: ID du centre d'intérêt pour filtrer (1=Restos, 2=Cinéma, 3=Shopping, 4=Culture, 5=Sport, 6=Bien-être, 7=Musique, 8=Voyages)
 *     responses:
 *       200:
 *         description: Liste des posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 30 }
 *                 data:
 *                   type: array
 *                   items: { $ref: "#/components/schemas/Post" }
 */
router.get('/', postController.listerPosts);

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Récupérer un post précis avec ses commentaires
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Post + commentaires
 *       404:
 *         description: Post introuvable
 */
router.get('/:id', postController.recupererPost);

/**
 * @openapi
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Créer un nouveau post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contenu]
 *             properties:
 *               contenu: { type: string, example: "🌸 Mon premier post !", description: "Max 500 caractères" }
 *               photos_urls: { type: array, items: { type: string }, description: "Max 4 URLs d'images" }
 *     responses:
 *       201:
 *         description: Post créé
 *       400:
 *         description: Contenu invalide ou trop long
 *       401:
 *         description: Token manquant
 */
router.post('/', authentifier, postController.creerPost);

/**
 * @openapi
 * /api/posts/{id}/like:
 *   post:
 *     tags: [Posts]
 *     summary: Liker un post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Post liké ❤️
 *       404:
 *         description: Post introuvable
 *       409:
 *         description: Post déjà liké
 */
router.post('/:id/like', authentifier, postController.likerPost);

/**
 * @openapi
 * /api/posts/{id}/like:
 *   delete:
 *     tags: [Posts]
 *     summary: Retirer son like d'un post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Like retiré
 *       404:
 *         description: Like introuvable
 */
router.delete('/:id/like', authentifier, postController.unlikePost);
/**
 * @openapi
 * /api/posts/{id}/commentaires:
 *   post:
 *     tags: [Posts]
 *     summary: Ajouter un commentaire à un post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contenu]
 *             properties:
 *               contenu: { type: string, example: "Super post ! 🌸", description: "Max 500 caractères" }
 *     responses:
 *       201:
 *         description: Commentaire créé
 *       400:
 *         description: Contenu invalide
 *       401:
 *         description: Token manquant
 *       404:
 *         description: Post introuvable
 */
router.post('/:id/commentaires', authentifier, postController.creerCommentaire);

export default router;
// ============================================================================
// SISTER SPACE — Routes Messagerie
// ============================================================================

import { Router } from 'express';
import * as messageController from '../controllers/message.controller';
import { authentifier } from '../middlewares/auth.middleware';

const router = Router();

// Toutes les routes nécessitent JWT
router.use(authentifier);

router.get('/', messageController.listerConversations);
router.post('/', messageController.demarrerConversation);
router.get('/:id/messages', messageController.recupererMessages);
router.post('/:id/messages', messageController.envoyerMessage);
/**
 * @openapi
 * /api/conversations/non-lus:
 *   get:
 *     tags: [Conversations]
 *     summary: Compter le nombre total de messages non lus
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nombre de messages non lus
 */
router.get('/non-lus', authentifier, messageController.compterNonLus);
export default router;
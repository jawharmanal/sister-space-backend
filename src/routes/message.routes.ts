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

export default router;
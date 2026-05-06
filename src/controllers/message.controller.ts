// ============================================================================
// SISTER SPACE — Contrôleur Messagerie
// ============================================================================

import { Request, Response } from 'express';
import * as messageService from '../services/message.service';

// GET /api/conversations
export const listerConversations = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const conversations = await messageService.listerConversations(req.utilisatrice.id);
    return res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error('Erreur lister conversations :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// GET /api/conversations/:id/messages
export const recupererMessages = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID invalide' });
    }

    const data = await messageService.recupererMessages(id, req.utilisatrice.id);
    return res.status(200).json({ success: true, data });

  } catch (error: any) {
    if (error.message === 'CONVERSATION_INTROUVABLE') {
      return res.status(404).json({ success: false, message: 'Conversation introuvable' });
    }
    if (error.message === 'ACCES_REFUSE') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }
    console.error('Erreur récupérer messages :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/conversations/:id/messages
export const envoyerMessage = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const id_conv = parseInt(req.params.id as string);
    if (isNaN(id_conv)) {
      return res.status(400).json({ success: false, message: 'ID invalide' });
    }

    const { contenu } = req.body;
    if (!contenu || contenu.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Le message ne peut pas être vide' });
    }

    const message = await messageService.envoyerMessage(id_conv, req.utilisatrice.id, contenu);
    return res.status(201).json({
      success: true,
      message: 'Message envoyé',
      data: message,
    });

  } catch (error: any) {
    if (error.message === 'CONVERSATION_INTROUVABLE') {
      return res.status(404).json({ success: false, message: 'Conversation introuvable' });
    }
    if (error.message === 'ACCES_REFUSE') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }
    console.error('Erreur envoyer message :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/conversations
export const demarrerConversation = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const { id_destinataire } = req.body;
    if (!id_destinataire) {
      return res.status(400).json({ success: false, message: 'ID destinataire requis' });
    }

    const conv = await messageService.demarrerConversation(req.utilisatrice.id, id_destinataire);
    return res.status(200).json({ success: true, data: conv });

  } catch (error: any) {
    if (error.message === 'PAS_AVEC_SOI_MEME') {
      return res.status(400).json({ success: false, message: 'Impossible de discuter avec soi-même' });
    }
    console.error('Erreur démarrer conversation :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
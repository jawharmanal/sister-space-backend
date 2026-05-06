// ============================================================================
// SISTER SPACE — Contrôleur Posts
// ============================================================================

import { Request, Response } from 'express';
import * as postService from '../services/post.service';

// ----------------------------------------------------------------------------
// GET /api/posts — Lister les posts du fil (avec filtre optionnel)
// Query param : ?categorie=ID
// ----------------------------------------------------------------------------
export const listerPosts = async (req: Request, res: Response) => {
  try {
    // Récupérer le filtre depuis l'URL (?categorie=3)
    const categorieParam = req.query.categorie as string | undefined;
    const id_centre_interet = categorieParam ? parseInt(categorieParam) : undefined;

    const posts = await postService.listerPosts(id_centre_interet);
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error('Erreur lister posts :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// GET /api/posts/:id — Récupérer un post précis
// ----------------------------------------------------------------------------
export const recupererPost = async (req: Request, res: Response) => {
  try {
    const id_post = parseInt(req.params.id as string);
    if (isNaN(id_post)) {
      return res.status(400).json({ success: false, message: 'ID invalide' });
    }

    const post = await postService.recupererPost(id_post);
    return res.status(200).json({ success: true, data: post });

  } catch (error: any) {
    if (error.message === 'POST_INTROUVABLE') {
      return res.status(404).json({ success: false, message: 'Post introuvable' });
    }
    console.error('Erreur récupérer post :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// POST /api/posts — Créer un post (protégée)
// ----------------------------------------------------------------------------
export const creerPost = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const { contenu, photos_urls } = req.body;

    if (!contenu || contenu.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Le contenu ne peut pas être vide' });
    }

    const post = await postService.creerPost({
      contenu,
      photos_urls,
      id_auteure: req.utilisatrice.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Post créé avec succès',
      data: post,
    });

  } catch (error: any) {
    if (error.message === 'CONTENU_TROP_LONG') {
      return res.status(400).json({ success: false, message: 'Le post ne peut pas dépasser 500 caractères' });
    }
    if (error.message === 'TROP_DE_PHOTOS') {
      return res.status(400).json({ success: false, message: 'Maximum 4 photos par post' });
    }
    console.error('Erreur créer post :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// POST /api/posts/:id/like — Liker un post (protégée)
// ----------------------------------------------------------------------------
export const likerPost = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const id_post = parseInt(req.params.id as string);
    if (isNaN(id_post)) {
      return res.status(400).json({ success: false, message: 'ID invalide' });
    }

    await postService.likerPost(id_post, req.utilisatrice.id);
    return res.status(200).json({ success: true, message: 'Post liké ❤️' });

  } catch (error: any) {
    if (error.message === 'POST_INTROUVABLE') {
      return res.status(404).json({ success: false, message: 'Post introuvable' });
    }
    if (error.message === 'DEJA_LIKE') {
      return res.status(409).json({ success: false, message: 'Vous avez déjà liké ce post' });
    }
    console.error('Erreur liker post :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ----------------------------------------------------------------------------
// DELETE /api/posts/:id/like — Retirer son like (protégée)
// ----------------------------------------------------------------------------
export const unlikePost = async (req: Request, res: Response) => {
  try {
    if (!req.utilisatrice) {
      return res.status(401).json({ success: false, message: 'Non authentifiée' });
    }

    const id_post = parseInt(req.params.id as string);
    if (isNaN(id_post)) {
      return res.status(400).json({ success: false, message: 'ID invalide' });
    }

    await postService.unlikePost(id_post, req.utilisatrice.id);
    return res.status(200).json({ success: true, message: 'Like retiré' });

  } catch (error: any) {
    if (error.message === 'LIKE_INTROUVABLE') {
      return res.status(404).json({ success: false, message: 'Like introuvable' });
    }
    console.error('Erreur unlike post :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
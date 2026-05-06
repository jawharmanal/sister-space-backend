// ============================================================================
// SISTER SPACE — Service Messagerie
// ============================================================================

import pool from '../config/database';

// ----------------------------------------------------------------------------
// Lister les conversations d'une utilisatrice
// ----------------------------------------------------------------------------
export const listerConversations = async (id_utilisatrice: number) => {
  const resultat = await pool.query(`
    SELECT 
      c.id,
      c.derniere_activite,
      CASE 
        WHEN c.id_utilisatrice_1 = $1 THEN c.id_utilisatrice_2
        ELSE c.id_utilisatrice_1
      END AS id_autre,
      u.prenom AS autre_prenom,
      u.pseudo AS autre_pseudo,
      (SELECT contenu FROM Message WHERE id_conversation = c.id 
       ORDER BY date_envoi DESC LIMIT 1) AS dernier_message,
      (SELECT date_envoi FROM Message WHERE id_conversation = c.id 
       ORDER BY date_envoi DESC LIMIT 1) AS date_dernier_message,
      (SELECT COUNT(*) FROM Message 
       WHERE id_conversation = c.id 
       AND id_expeditrice <> $1 
       AND est_lu = FALSE) AS nb_non_lus
    FROM Conversation c
    JOIN Utilisatrice u ON u.id = (
      CASE WHEN c.id_utilisatrice_1 = $1 THEN c.id_utilisatrice_2 ELSE c.id_utilisatrice_1 END
    )
    WHERE c.id_utilisatrice_1 = $1 OR c.id_utilisatrice_2 = $1
    ORDER BY c.derniere_activite DESC
  `, [id_utilisatrice]);

  return resultat.rows;
};

// ----------------------------------------------------------------------------
// Récupérer les messages d'une conversation
// ----------------------------------------------------------------------------
export const recupererMessages = async (id_conversation: number, id_utilisatrice: number) => {
  // Vérifier que l'utilisatrice fait partie de la conversation
  const conv = await pool.query(`
    SELECT id, id_utilisatrice_1, id_utilisatrice_2
    FROM Conversation
    WHERE id = $1
  `, [id_conversation]);

  if (conv.rows.length === 0) {
    throw new Error('CONVERSATION_INTROUVABLE');
  }

  const conversation = conv.rows[0];
  if (conversation.id_utilisatrice_1 !== id_utilisatrice && conversation.id_utilisatrice_2 !== id_utilisatrice) {
    throw new Error('ACCES_REFUSE');
  }

  // Récupérer les infos de l'autre utilisatrice
  const id_autre = conversation.id_utilisatrice_1 === id_utilisatrice 
    ? conversation.id_utilisatrice_2 
    : conversation.id_utilisatrice_1;

  const autre = await pool.query(`
    SELECT id, prenom, pseudo FROM Utilisatrice WHERE id = $1
  `, [id_autre]);

  // Récupérer les messages
  const messages = await pool.query(`
    SELECT id, id_expeditrice, contenu, date_envoi, est_lu
    FROM Message
    WHERE id_conversation = $1
    ORDER BY date_envoi ASC
  `, [id_conversation]);

  // Marquer comme lus les messages reçus
  await pool.query(`
    UPDATE Message 
    SET est_lu = TRUE
    WHERE id_conversation = $1 AND id_expeditrice <> $2 AND est_lu = FALSE
  `, [id_conversation, id_utilisatrice]);

  return {
    conversation: {
      id: conversation.id,
      autre: autre.rows[0],
    },
    messages: messages.rows,
  };
};

// ----------------------------------------------------------------------------
// Envoyer un message
// ----------------------------------------------------------------------------
export const envoyerMessage = async (id_conversation: number, id_expeditrice: number, contenu: string) => {
  // Vérifier la conversation
  const conv = await pool.query(`
    SELECT id_utilisatrice_1, id_utilisatrice_2
    FROM Conversation
    WHERE id = $1
  `, [id_conversation]);

  if (conv.rows.length === 0) {
    throw new Error('CONVERSATION_INTROUVABLE');
  }

  const conversation = conv.rows[0];
  if (conversation.id_utilisatrice_1 !== id_expeditrice && conversation.id_utilisatrice_2 !== id_expeditrice) {
    throw new Error('ACCES_REFUSE');
  }

  // Insérer le message
  const message = await pool.query(`
    INSERT INTO Message (id_conversation, id_expeditrice, contenu)
    VALUES ($1, $2, $3)
    RETURNING id, id_conversation, id_expeditrice, contenu, date_envoi, est_lu
  `, [id_conversation, id_expeditrice, contenu]);

  // Mettre à jour la dernière activité de la conversation
  await pool.query(`
    UPDATE Conversation 
    SET derniere_activite = CURRENT_TIMESTAMP
    WHERE id = $1
  `, [id_conversation]);

  return message.rows[0];
};

// ----------------------------------------------------------------------------
// Démarrer une conversation avec une utilisatrice (ou récupérer si existe)
// ----------------------------------------------------------------------------
export const demarrerConversation = async (id_utilisatrice_1: number, id_utilisatrice_2: number) => {
  if (id_utilisatrice_1 === id_utilisatrice_2) {
    throw new Error('PAS_AVEC_SOI_MEME');
  }

  // Vérifier si une conversation existe déjà
  const existante = await pool.query(`
    SELECT id FROM Conversation
    WHERE (id_utilisatrice_1 = $1 AND id_utilisatrice_2 = $2)
       OR (id_utilisatrice_1 = $2 AND id_utilisatrice_2 = $1)
  `, [id_utilisatrice_1, id_utilisatrice_2]);

  if (existante.rows.length > 0) {
    return { id: existante.rows[0].id, deja_existante: true };
  }

  // Créer une nouvelle conversation
  const nouvelle = await pool.query(`
    INSERT INTO Conversation (id_utilisatrice_1, id_utilisatrice_2)
    VALUES ($1, $2)
    RETURNING id
  `, [id_utilisatrice_1, id_utilisatrice_2]);

  return { id: nouvelle.rows[0].id, deja_existante: false };
};
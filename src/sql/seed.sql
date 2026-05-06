-- ============================================================================
-- SISTER SPACE — Script de SEED (données de test) — Version régénérée
-- ============================================================================

-- ============================================================================
-- 1. INSERTION DES UTILISATRICES (mot de passe = "Test1234!" pour toutes)
-- ============================================================================

INSERT INTO Utilisatrice
(email, mot_de_passe_hash, prenom, pseudo, date_naissance, id_ville, bio, photo_profil_url, statut, role, date_creation, date_validation)
VALUES
('admin@sisterspace.fr', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Manal', '@manal_admin', '1995-03-15', 1, 'Fondatrice de Sister Space 🌸', NULL, 'ACTIF', 'ADMIN', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('emma.park@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Emma', '@emmapark', '1996-07-22', 1, 'Designer UX · slow mornings · hot yoga · matcha lover', NULL, 'ACTIF', 'UTILISATRICE', '2026-02-10 14:30:00', '2026-02-11 09:15:00'),
('maya.chen@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Maya', '@maya_c', '1992-11-05', 2, 'En reconversion entrepreneuriale ✨ Passionnée de café', NULL, 'ACTIF', 'UTILISATRICE', '2026-02-12 09:00:00', '2026-02-12 18:00:00'),
('sophia.r@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Sophia', '@sophia_r', '2000-05-18', 1, 'Étudiante master · yoga · voyages · cuisine 🍳', NULL, 'ACTIF', 'UTILISATRICE', '2026-02-15 11:00:00', '2026-02-15 20:00:00'),
('priya.k@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Priya', '@priya_k', '1994-09-30', 1, 'Marketing digital · runner · weekend baker', NULL, 'ACTIF', 'UTILISATRICE', '2026-02-18 16:00:00', '2026-02-19 10:00:00'),
('jules.m@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Jules', '@jules_m', '1991-12-12', 3, 'Avocate · lectrice compulsive · maman de 2', NULL, 'ACTIF', 'UTILISATRICE', '2026-02-20 12:00:00', '2026-02-20 19:00:00'),
('lina.s@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Lina', '@lina_s', '1998-04-25', 5, 'Photographe freelance · road trips · sunsets', NULL, 'ACTIF', 'UTILISATRICE', '2026-02-22 17:00:00', '2026-02-23 11:00:00'),
('clara.b@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Clara', '@clara_b', '1993-08-08', 4, 'Prof de français · grande lectrice · jardinage urbain 🌱', NULL, 'ACTIF', 'UTILISATRICE', '2026-02-25 14:00:00', '2026-02-26 08:30:00'),
('nora.t@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Nora', '@nora_t', '1997-01-19', 6, 'Architecte · design lover · wine & cheese 🧀', NULL, 'ACTIF', 'UTILISATRICE', '2026-02-28 10:00:00', '2026-02-28 21:00:00'),
('ines.l@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Inès', '@ines_l', '1995-06-14', 1, 'Médecin · trail runner · café > thé toujours', NULL, 'ACTIF', 'UTILISATRICE', '2026-03-02 13:00:00', '2026-03-02 22:00:00'),
('alice.d@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Alice', '@alice_d', '1989-10-03', 2, 'Cheffe d''entreprise · adepte de la course matinale', NULL, 'ACTIF', 'UTILISATRICE', '2026-03-05 11:30:00', '2026-03-05 19:45:00'),
('lou.f@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Lou', '@lou_f', '2001-02-28', 7, 'Étudiante en architecture · explorer of cities', NULL, 'ACTIF', 'UTILISATRICE', '2026-03-08 15:00:00', '2026-03-09 09:00:00'),
('zoe.new@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Zoé', '@zoe_n', '1999-07-04', 1, 'Nouvelle à Paris, à la recherche de bonnes adresses', NULL, 'EN_ATTENTE', 'UTILISATRICE', '2026-05-01 09:00:00', NULL),
('camille.r@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Camille', '@camille_r', '1996-03-21', 2, 'Designer freelance, passionnée de mode éthique', NULL, 'EN_ATTENTE', 'UTILISATRICE', '2026-05-02 14:00:00', NULL),
('sarah.j@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Sarah', '@sarah_j', '1990-11-11', 8, 'Maman solo, j''aime cuisiner et le théâtre', NULL, 'EN_ATTENTE', 'UTILISATRICE', '2026-05-03 10:30:00', NULL),
('lea.b@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Léa', '@lea_b', '1994-08-17', 1, 'Coach sportive certifiée · bien-être & nutrition', NULL, 'EN_ATTENTE', 'UTILISATRICE', '2026-05-04 16:00:00', NULL),
('mystery.user@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Alex', '@alex_mystery', '1998-01-01', 1, 'Bio vide', NULL, 'INFOS_DEMANDEES', 'UTILISATRICE', '2026-05-04 12:00:00', NULL),
('refuse1@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Profil1', '@refuse_1', '2000-01-01', 1, 'Bio suspecte', NULL, 'REFUSE', 'UTILISATRICE', '2026-04-15 09:00:00', '2026-04-16 10:00:00'),
('refuse2@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'Profil2', '@refuse_2', '2002-05-01', 2, 'Compte douteux', NULL, 'REFUSE', 'UTILISATRICE', '2026-04-20 14:00:00', '2026-04-21 11:00:00'),
('banni1@email.com', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'BannieA', '@bannie_a', '1990-03-15', 1, 'Compte suspendu', NULL, 'BANNI', 'UTILISATRICE', '2026-03-15 10:00:00', '2026-03-15 15:00:00'),
('test@sisterspace.fr', '$2b$12$LQv3c1yqBwEHxv7K8f8MyOzqYJ3xVR5cZJB0nJ5XnTZQhZfYJ.7Sa', 'TestUser', '@test_user', '1995-01-01', 1, 'Compte de test pour développement', NULL, 'ACTIF', 'UTILISATRICE', '2026-01-15 12:00:00', '2026-01-15 13:00:00');

UPDATE Utilisatrice SET motif_refus = 'Bio incohérente, suspicion de faux profil' WHERE pseudo = '@refuse_1';
UPDATE Utilisatrice SET motif_refus = 'Compte suspect, données peu plausibles' WHERE pseudo = '@refuse_2';


-- ============================================================================
-- 2. LIAISONS UTILISATRICES ↔ CENTRES D'INTÉRÊT
-- ============================================================================
INSERT INTO Utilisatrice_CentreInteret (id_utilisatrice, id_centre_interet) VALUES
(1, 1), (1, 4), (1, 7),
(2, 1), (2, 4), (2, 5), (2, 6),
(3, 1), (3, 8), (3, 6),
(4, 2), (4, 5), (4, 8), (4, 7), (4, 6),
(5, 5), (5, 3), (5, 1),
(6, 4), (6, 1), (6, 2),
(7, 8), (7, 4), (7, 7),
(8, 4), (8, 6), (8, 8),
(9, 1), (9, 4), (9, 8),
(10, 5), (10, 1), (10, 8),
(11, 5), (11, 8), (11, 4),
(12, 4), (12, 8), (12, 7),
(21, 1), (21, 5), (21, 8);


-- ============================================================================
-- 3. POSTS
-- ============================================================================
INSERT INTO Post (id_auteure, contenu, photos_urls, date_creation) VALUES
(3, 'Just got offered a role with a 30% raise but it means moving cities alone. Has anyone made a leap like this in their late 20s? How did you decide?', NULL, '2026-04-28 14:00:00'),
(3, 'Update : j''ai dit oui ! Merci pour vos retours, ça m''a vraiment aidée 💗', NULL, '2026-05-01 09:00:00'),
(4, 'Wine + paint night chez Rosa''s samedi vers 19h. 2 places restantes — qui veut venir?', '["https://example.com/photos/wine_paint.jpg"]', '2026-04-30 18:30:00'),
(4, 'Un super spot que j''ai découvert ce weekend : le rooftop du Perchoir au sunset 🌅 Magique !', '["https://example.com/photos/rooftop1.jpg", "https://example.com/photos/rooftop2.jpg"]', '2026-05-02 20:00:00'),
(2, 'Has anyone done a solo trip to Lisbon? Looking for safe neighborhoods, hidden cafés, and tips for a 5-day trip end of May.', NULL, '2026-04-25 10:00:00'),
(2, 'Mon spot pour le matcha à Paris : Cha Cha Matcha à Saint-Germain. Le meilleur que j''ai goûté !', '["https://example.com/photos/matcha.jpg"]', '2026-05-03 11:00:00'),
(5, 'Course matinale dans Paris ce dimanche, départ 8h Place de la République. Niveau 5-7km. Qui me rejoint?', NULL, '2026-04-29 19:00:00'),
(5, 'Banana bread aux pépites de chocolat ✨ Recette sur demande !', '["https://example.com/photos/banana_bread.jpg"]', '2026-05-04 16:30:00'),
(6, 'Conseil de lecture du moment : "Les Sept Maris d''Evelyn Hugo". Je ne pouvais plus le lâcher 📚', NULL, '2026-04-22 21:00:00'),
(6, 'Maman solo · est-ce que d''autres mamans connaissent des activités pour kids 4-7 ans à Marseille ?', NULL, '2026-04-27 08:30:00'),
(7, 'Mes photos du dernier road trip Bordeaux → Côte basque. Le Sud Ouest me manque déjà ! 🌊', '["https://example.com/photos/roadtrip1.jpg", "https://example.com/photos/roadtrip2.jpg"]', '2026-04-28 17:00:00'),
(8, 'Mon balcon a fini par avoir le potager dont je rêvais ! 🌱 Tomates cerises, basilic, fraises...', '["https://example.com/photos/jardin.jpg"]', '2026-05-01 11:00:00'),
(8, 'Question : quelqu''un connaît un bon livre pour apprendre l''italien (niveau A2) ?', NULL, '2026-05-02 19:00:00'),
(9, 'Soirée wine & cheese chez moi vendredi. 4 places. DM si vous voulez venir 🍷', NULL, '2026-04-30 12:00:00'),
(9, 'L''expo Picasso au Centre Pompidou est INCROYABLE. À voir avant le 30 mai !', NULL, '2026-05-03 14:00:00'),
(10, 'J''ai couru mon premier semi-marathon ce weekend. 1h52, je suis tellement fière 💪', NULL, '2026-04-29 21:00:00'),
(11, 'Conseil pour mes femmes entrepreneuses : ne sous-estimez jamais le pouvoir d''un bon network féminin 💼', NULL, '2026-05-02 10:00:00'),
(12, 'Première année à Nantes ✨ La ville est tellement vivante !', '["https://example.com/photos/nantes.jpg"]', '2026-04-26 15:00:00'),
(12, 'Quelqu''un connaît des restos étudiants/abordables près de la fac ?', NULL, '2026-05-01 18:00:00'),
(4, 'Yoga matinal au parc Monceau samedi 9h. Tapis et bonne humeur required ☀️', NULL, '2026-05-04 08:00:00'),
(2, 'Un musée à recommander absolument à Paris : le musée de la Vie Romantique. Cachet d''un autre temps.', '["https://example.com/photos/musee.jpg"]', '2026-05-04 19:00:00'),
(5, 'Mes 3 must-have running pour la pluie : veste Decathlon, casquette imperméable, chaussettes mérinos.', NULL, '2026-04-15 17:00:00'),
(8, 'L''art floral de Constance Spry · une lecture pour les amoureuses des fleurs', NULL, '2026-04-18 09:30:00'),
(10, 'Café > thé. Je le dis je le maintiens ☕', NULL, '2026-04-20 07:30:00'),
(7, 'Mes photos préférées sont toujours celles non posées 📷', NULL, '2026-04-22 14:00:00'),
(2, 'Slow morning · matcha · journal · gratitude. Ma routine du dimanche 🌸', NULL, '2026-04-23 10:00:00'),
(3, 'Comment vous gérez le stress quand vous changez de carrière?', NULL, '2026-04-19 22:00:00'),
(6, 'Tout ce que tu dois savoir, je l''ai appris à la maternelle — toujours valable', NULL, '2026-04-21 20:00:00'),
(9, 'Cherche partenaire pour cours d''italien sur Nice. Échange français contre italien?', NULL, '2026-04-24 11:00:00'),
(11, 'Mon mantra : Done is better than perfect', NULL, '2026-04-25 16:00:00');


-- ============================================================================
-- 4. LIAISONS POSTS ↔ TAGS
-- ============================================================================
INSERT INTO Post_Tag (id_post, id_tag) VALUES
(1, 1), (1, 3), (3, 2), (4, 4), (5, 3), (6, 4),
(7, 2), (8, 4), (9, 4), (10, 3), (14, 2), (15, 4),
(19, 3), (20, 2);


-- ============================================================================
-- 5. COMMENTAIRES
-- ============================================================================
INSERT INTO Commentaire (id_post, id_auteure, contenu, date_creation) VALUES
(1, 2, 'J''ai fait pareil en 2023 ! Honnêtement c''était dur les premiers mois mais aucune regret 💗', '2026-04-28 15:00:00'),
(1, 6, 'Question importante : tu as un réseau dans la nouvelle ville ? Ça change tout.', '2026-04-28 16:00:00'),
(1, 11, 'Si l''opportunité est unique, fonce. Le réseau se construit.', '2026-04-28 18:00:00'),
(3, 2, 'Trop tentée ! Je peux venir 🎨', '2026-04-30 19:00:00'),
(3, 5, 'Je serais bien venue mais déjà prise samedi 😭 Next time !', '2026-04-30 20:00:00'),
(5, 7, 'Lisbonne en mai = parfait ! Va à Alfama, quartier magique ✨', '2026-04-25 11:00:00'),
(5, 4, 'Time Out Market pour manger, le tram 28 pour visiter, et regarde Sky Bar !', '2026-04-25 12:00:00'),
(5, 9, 'Je peux te partager mon itinéraire en DM si tu veux !', '2026-04-25 14:00:00'),
(6, 3, 'Je teste demain merci !', '2026-05-03 12:00:00'),
(7, 10, 'Carrément ! Je viens 🏃‍♀️', '2026-04-29 20:00:00'),
(7, 11, 'Niveau parfait pour moi, je me joins', '2026-04-30 08:00:00'),
(9, 8, 'Coup de cœur de l''année pour moi aussi', '2026-04-22 22:00:00'),
(11, 2, 'Tes photos sont magiques 😍', '2026-04-28 18:00:00'),
(12, 8, 'Trop fier de toi 🌱 Mes tomates n''ont jamais survécu', '2026-05-01 12:00:00'),
(13, 2, 'Présente ! 🍷', '2026-04-30 13:00:00');


-- ============================================================================
-- 6. LIKES
-- ============================================================================
INSERT INTO Likes (id_post, id_utilisatrice, date_creation) VALUES
(1, 2, '2026-04-28 14:30:00'), (1, 4, '2026-04-28 15:00:00'), (1, 5, '2026-04-28 15:30:00'),
(1, 6, '2026-04-28 16:00:00'), (1, 7, '2026-04-28 17:00:00'), (1, 8, '2026-04-28 18:00:00'),
(1, 9, '2026-04-28 19:00:00'), (1, 10, '2026-04-28 20:00:00'), (1, 11, '2026-04-28 21:00:00'),
(1, 12, '2026-04-28 22:00:00'),
(3, 2, '2026-04-30 19:00:00'), (3, 5, '2026-04-30 19:30:00'), (3, 7, '2026-04-30 20:00:00'),
(5, 4, '2026-04-25 11:00:00'), (5, 7, '2026-04-25 11:30:00'), (5, 9, '2026-04-25 13:00:00'),
(5, 12, '2026-04-25 16:00:00'),
(6, 3, '2026-05-03 12:00:00'), (6, 4, '2026-05-03 13:00:00'), (6, 8, '2026-05-03 14:00:00'),
(7, 10, '2026-04-29 20:00:00'), (7, 11, '2026-04-29 21:00:00'),
(8, 2, '2026-05-04 17:00:00'), (8, 8, '2026-05-04 18:00:00'), (8, 9, '2026-05-04 19:00:00'),
(11, 2, '2026-04-28 18:00:00'), (11, 4, '2026-04-28 18:30:00'), (11, 8, '2026-04-28 19:00:00'),
(11, 9, '2026-04-28 20:00:00'), (11, 12, '2026-04-28 21:00:00'),
(12, 6, '2026-05-01 12:00:00'), (12, 8, '2026-05-01 13:00:00'), (12, 9, '2026-05-01 14:00:00'),
(14, 2, '2026-05-03 15:00:00'), (14, 4, '2026-05-03 16:00:00'), (14, 6, '2026-05-03 17:00:00'),
(15, 2, '2026-04-29 22:00:00'), (15, 5, '2026-04-29 22:30:00'), (15, 7, '2026-04-29 23:00:00'),
(15, 9, '2026-04-30 08:00:00'), (15, 11, '2026-04-30 09:00:00'),
(16, 3, '2026-05-02 11:00:00'), (16, 5, '2026-05-02 12:00:00'), (16, 9, '2026-05-02 13:00:00');


-- ============================================================================
-- 7. CONVERSATIONS ET MESSAGES
-- ============================================================================
INSERT INTO Conversation (id_utilisatrice_1, id_utilisatrice_2, date_creation, derniere_activite)
VALUES (4, 2, '2026-05-04 14:00:00', '2026-05-04 14:18:00');

INSERT INTO Message (id_conversation, id_expeditrice, contenu, date_envoi, est_lu) VALUES
(1, 4, 'hey!! did you see Maya posted about Lisbon?', '2026-05-04 14:14:00', TRUE),
(1, 4, 'we should do a girls trip soon 🌴✈️', '2026-05-04 14:14:30', TRUE),
(1, 2, 'omg YES I was just thinking that', '2026-05-04 14:15:00', TRUE),
(1, 2, 'late may works for me — maybe May 22-27?', '2026-05-04 14:16:00', TRUE),
(1, 4, 'perfect 💗 I''ll start a planning chat', '2026-05-04 14:18:00', FALSE);

INSERT INTO Conversation (id_utilisatrice_1, id_utilisatrice_2, date_creation, derniere_activite)
VALUES (3, 2, '2026-05-03 16:00:00', '2026-05-04 12:00:00');

INSERT INTO Message (id_conversation, id_expeditrice, contenu, date_envoi, est_lu) VALUES
(2, 3, 'Hey Emma! Lmk how the interview goes 🤞', '2026-05-03 16:00:00', TRUE),
(2, 2, 'merci !! je te dis tout demain', '2026-05-03 17:00:00', TRUE),
(2, 2, 'ça s''est super bien passé !! ils me rappellent demain', '2026-05-04 12:00:00', FALSE);

INSERT INTO Conversation (id_utilisatrice_1, id_utilisatrice_2, date_creation, derniere_activite)
VALUES (5, 10, '2026-04-29 20:30:00', '2026-04-30 09:00:00');

INSERT INTO Message (id_conversation, id_expeditrice, contenu, date_envoi, est_lu) VALUES
(3, 5, 'Hey Inès, super que tu viennes dimanche !', '2026-04-29 20:30:00', TRUE),
(3, 10, 'Trop hâte ! Tu fais quel rythme habituellement ?', '2026-04-29 21:00:00', TRUE),
(3, 5, 'Du 6:00/km tranquille, on adapte', '2026-04-29 21:15:00', TRUE),
(3, 10, 'Parfait ✨ À dimanche !', '2026-04-30 09:00:00', TRUE);


-- ============================================================================
-- 8. SIGNALEMENTS
-- ============================================================================
INSERT INTO Signalement (id_utilisatrice_signalante, type_cible, id_cible, motif, statut, date_signalement) VALUES
(2, 'UTILISATRICE', 19, 'Comportement inapproprié dans les messages privés, harcèlement', 'TRAITE', '2026-03-15 14:00:00'),
(5, 'POST', 24, 'Promotion d''un produit non autorisé', 'EN_ATTENTE', '2026-05-04 18:00:00'),
(3, 'COMMENTAIRE', 8, 'Désaccord sur l''opinion exprimée', 'REJETE', '2026-04-28 19:30:00');


-- ============================================================================
-- FIN DU SCRIPT DE SEED
-- ============================================================================
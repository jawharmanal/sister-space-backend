-- ============================================================================
-- SISTER SPACE — Script de création de la base de données
-- ============================================================================
-- Projet : RNCP 37873 — Concepteur Développeur d'Applications
-- SGBD   : PostgreSQL 16
-- Version: 1.0
-- ============================================================================
--
-- Ce script crée :
--   - 12 tables (10 entités + 2 tables de liaison)
--   - 3 ENUM types pour les statuts (sécurité + lisibilité)
--   - Toutes les contraintes (clés primaires, étrangères, unicité, vérifications)
--   - Les index pour optimiser les recherches fréquentes
--   - Les commentaires SQL pour documenter chaque table
--
-- Ordre d'exécution important :
--   1. Tables de référence (Ville, CentreInteret, Tag) — sans dépendances
--   2. Table Utilisatrice — dépend de Ville
--   3. Tables de contenu (Post, Commentaire, Likes) — dépendent d'Utilisatrice
--   4. Tables de messagerie (Conversation, Message) — dépendent d'Utilisatrice
--   5. Table Signalement — dépend d'Utilisatrice
--   6. Tables de liaison (Utilisatrice_CentreInteret, Post_Tag)
--
-- ============================================================================

-- Suppression de la base existante si elle existe déjà (pour rejouer le script)
-- ATTENTION : décommente la ligne suivante UNIQUEMENT si tu veux tout effacer
-- DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;


-- ============================================================================
-- TYPES ENUM (énumérations) — pour limiter les valeurs autorisées
-- ============================================================================

-- Statut du compte d'une utilisatrice (cycle de vie d'un compte)
CREATE TYPE statut_compte AS ENUM (
    'EN_ATTENTE',       -- Inscription créée, validation administrative en cours
    'INFOS_DEMANDEES',  -- L'admin a demandé des précisions
    'ACTIF',            -- Compte validé, accès complet
    'REFUSE',           -- Inscription refusée par l'admin
    'BANNI'             -- Compte suspendu suite à un signalement
);

-- Rôle d'une utilisatrice (système de permissions)
CREATE TYPE role_utilisatrice AS ENUM (
    'UTILISATRICE',     -- Membre standard de la communauté
    'ADMIN'             -- Administratrice (validation comptes, modération)
);

-- Type de l'élément ciblé par un signalement
CREATE TYPE type_signalement AS ENUM (
    'POST',
    'COMMENTAIRE',
    'MESSAGE',
    'UTILISATRICE'
);

-- Statut d'un signalement (suivi de modération)
CREATE TYPE statut_signalement AS ENUM (
    'EN_ATTENTE',  -- À traiter par l'admin
    'TRAITE',      -- Action prise (post supprimé, utilisatrice bannie...)
    'REJETE'       -- Signalement jugé non pertinent
);


-- ============================================================================
-- TABLES DE RÉFÉRENCE (sans dépendances)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table : Ville
-- ----------------------------------------------------------------------------
CREATE TABLE Ville (
    id              SERIAL PRIMARY KEY,
    nom             VARCHAR(100) NOT NULL UNIQUE,
    code_postal     VARCHAR(10)
);

COMMENT ON TABLE Ville IS 'Liste des villes françaises où vivent les utilisatrices';
COMMENT ON COLUMN Ville.nom IS 'Nom de la ville, unique pour éviter les doublons';

-- ----------------------------------------------------------------------------
-- Table : CentreInteret
-- ----------------------------------------------------------------------------
CREATE TABLE CentreInteret (
    id              SERIAL PRIMARY KEY,
    nom             VARCHAR(50) NOT NULL UNIQUE,
    emoji           VARCHAR(10)
);

COMMENT ON TABLE CentreInteret IS 'Les 8 catégories de centres d''intérêt (RM-11)';

-- ----------------------------------------------------------------------------
-- Table : Tag
-- ----------------------------------------------------------------------------
CREATE TABLE Tag (
    id              SERIAL PRIMARY KEY,
    nom             VARCHAR(50) NOT NULL UNIQUE
);

COMMENT ON TABLE Tag IS 'Tags pour catégoriser les posts (Advice, Outing, Question, Recommend)';


-- ============================================================================
-- TABLE PRINCIPALE : UTILISATRICE
-- ============================================================================
CREATE TABLE Utilisatrice (
    id                      SERIAL PRIMARY KEY,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe_hash       VARCHAR(255) NOT NULL,
    prenom                  VARCHAR(50)  NOT NULL,
    pseudo                  VARCHAR(30)  NOT NULL UNIQUE,
    date_naissance          DATE         NOT NULL,
    id_ville                INTEGER      NOT NULL,
    bio                     VARCHAR(150),
    photo_profil_url        VARCHAR(500),
    statut                  statut_compte     NOT NULL DEFAULT 'EN_ATTENTE',
    role                    role_utilisatrice NOT NULL DEFAULT 'UTILISATRICE',
    date_creation           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_validation         TIMESTAMP,
    motif_refus             TEXT,

    -- Clé étrangère vers Ville
    CONSTRAINT fk_utilisatrice_ville
        FOREIGN KEY (id_ville) REFERENCES Ville(id)
        ON DELETE RESTRICT,  -- Empêche de supprimer une ville utilisée

    -- Vérification : majorité (RM-09)
    CONSTRAINT chk_majorite
        CHECK (date_naissance <= (CURRENT_DATE - INTERVAL '18 years')),

    -- Vérification : email contient bien un @
    CONSTRAINT chk_email_format
        CHECK (email LIKE '%@%.%')
);

COMMENT ON TABLE Utilisatrice IS 'Comptes des membres de la communauté (RM-01, RM-07, RM-09)';
COMMENT ON COLUMN Utilisatrice.mot_de_passe_hash IS 'Mot de passe haché bcrypt — JAMAIS en clair (RM-02, ANSSI)';
COMMENT ON COLUMN Utilisatrice.statut IS 'Cycle de vie du compte (voir ENUM statut_compte)';

-- Index pour accélérer les recherches par email et pseudo (très fréquentes)
CREATE INDEX idx_utilisatrice_email ON Utilisatrice(email);
CREATE INDEX idx_utilisatrice_pseudo ON Utilisatrice(pseudo);
CREATE INDEX idx_utilisatrice_statut ON Utilisatrice(statut);


-- ============================================================================
-- TABLES DE CONTENU
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table : Post
-- ----------------------------------------------------------------------------
CREATE TABLE Post (
    id              SERIAL PRIMARY KEY,
    id_auteure      INTEGER NOT NULL,
    contenu         VARCHAR(500) NOT NULL,
    photos_urls     JSON,
    date_creation   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    est_supprime    BOOLEAN   NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_post_auteure
        FOREIGN KEY (id_auteure) REFERENCES Utilisatrice(id)
        ON DELETE CASCADE,  -- Si l'utilisatrice est supprimée, ses posts aussi

    CONSTRAINT chk_contenu_non_vide
        CHECK (LENGTH(TRIM(contenu)) > 0)
);

COMMENT ON TABLE Post IS 'Publications du fil d''actualité (RM-05 : max 500 caractères, max 4 photos)';
COMMENT ON COLUMN Post.photos_urls IS 'Tableau JSON d''URLs (max 4 photos), choix de simplification assumé';
COMMENT ON COLUMN Post.est_supprime IS 'Soft delete : on garde la ligne mais on la cache (pour modération)';

CREATE INDEX idx_post_auteure ON Post(id_auteure);
CREATE INDEX idx_post_date ON Post(date_creation DESC);

-- ----------------------------------------------------------------------------
-- Table : Commentaire
-- ----------------------------------------------------------------------------
CREATE TABLE Commentaire (
    id              SERIAL PRIMARY KEY,
    id_post         INTEGER NOT NULL,
    id_auteure      INTEGER NOT NULL,
    contenu         VARCHAR(300) NOT NULL,
    date_creation   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_commentaire_post
        FOREIGN KEY (id_post) REFERENCES Post(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_commentaire_auteure
        FOREIGN KEY (id_auteure) REFERENCES Utilisatrice(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_commentaire_non_vide
        CHECK (LENGTH(TRIM(contenu)) > 0)
);

COMMENT ON TABLE Commentaire IS 'Commentaires sous les posts (max 300 caractères)';

CREATE INDEX idx_commentaire_post ON Commentaire(id_post);

-- ----------------------------------------------------------------------------
-- Table : Likes (pluriel pour éviter le mot-clé SQL "LIKE")
-- ----------------------------------------------------------------------------
CREATE TABLE Likes (
    id                  SERIAL PRIMARY KEY,
    id_post             INTEGER NOT NULL,
    id_utilisatrice     INTEGER NOT NULL,
    date_creation       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_likes_post
        FOREIGN KEY (id_post) REFERENCES Post(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_likes_utilisatrice
        FOREIGN KEY (id_utilisatrice) REFERENCES Utilisatrice(id)
        ON DELETE CASCADE,

    -- Une utilisatrice ne peut liker un post qu'une seule fois
    CONSTRAINT uq_like_unique
        UNIQUE (id_post, id_utilisatrice)
);

COMMENT ON TABLE Likes IS 'Mentions "j''aime" sur les posts (renommée Likes car LIKE est mot-clé SQL)';

CREATE INDEX idx_likes_post ON Likes(id_post);
CREATE INDEX idx_likes_utilisatrice ON Likes(id_utilisatrice);


-- ============================================================================
-- TABLES DE MESSAGERIE PRIVÉE (RM-06)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table : Conversation
-- ----------------------------------------------------------------------------
CREATE TABLE Conversation (
    id                      SERIAL PRIMARY KEY,
    id_utilisatrice_1       INTEGER NOT NULL,
    id_utilisatrice_2       INTEGER NOT NULL,
    date_creation           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    derniere_activite       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conv_user1
        FOREIGN KEY (id_utilisatrice_1) REFERENCES Utilisatrice(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_conv_user2
        FOREIGN KEY (id_utilisatrice_2) REFERENCES Utilisatrice(id)
        ON DELETE CASCADE,

    -- Une seule conversation entre 2 utilisatrices données
    CONSTRAINT uq_conversation_paire
        UNIQUE (id_utilisatrice_1, id_utilisatrice_2),

    -- On ne peut pas avoir une conversation avec soi-même
    CONSTRAINT chk_pas_soi_meme
        CHECK (id_utilisatrice_1 <> id_utilisatrice_2)
);

COMMENT ON TABLE Conversation IS 'Fil de messages entre 2 utilisatrices (V1 = 1-à-1 uniquement)';

CREATE INDEX idx_conv_user1 ON Conversation(id_utilisatrice_1);
CREATE INDEX idx_conv_user2 ON Conversation(id_utilisatrice_2);
CREATE INDEX idx_conv_derniere_activite ON Conversation(derniere_activite DESC);

-- ----------------------------------------------------------------------------
-- Table : Message
-- ----------------------------------------------------------------------------
CREATE TABLE Message (
    id                  SERIAL PRIMARY KEY,
    id_conversation     INTEGER NOT NULL,
    id_expeditrice      INTEGER NOT NULL,
    contenu             TEXT NOT NULL,
    date_envoi          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    est_lu              BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_message_conversation
        FOREIGN KEY (id_conversation) REFERENCES Conversation(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_message_expeditrice
        FOREIGN KEY (id_expeditrice) REFERENCES Utilisatrice(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_message_non_vide
        CHECK (LENGTH(TRIM(contenu)) > 0)
);

COMMENT ON TABLE Message IS 'Messages individuels dans les conversations privées';

CREATE INDEX idx_message_conversation ON Message(id_conversation);
CREATE INDEX idx_message_date ON Message(date_envoi DESC);


-- ============================================================================
-- TABLE DE MODÉRATION : SIGNALEMENT (RM-04)
-- ============================================================================
CREATE TABLE Signalement (
    id                              SERIAL PRIMARY KEY,
    id_utilisatrice_signalante      INTEGER NOT NULL,
    type_cible                      type_signalement   NOT NULL,
    id_cible                        INTEGER            NOT NULL,
    motif                           TEXT               NOT NULL,
    statut                          statut_signalement NOT NULL DEFAULT 'EN_ATTENTE',
    date_signalement                TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_signalement_utilisatrice
        FOREIGN KEY (id_utilisatrice_signalante) REFERENCES Utilisatrice(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_motif_non_vide
        CHECK (LENGTH(TRIM(motif)) > 0)
);

COMMENT ON TABLE Signalement IS 'Système de modération communautaire (RM-04)';
COMMENT ON COLUMN Signalement.id_cible IS 'ID polymorphique : pointe vers Post, Commentaire, Message ou Utilisatrice selon type_cible';

CREATE INDEX idx_signalement_statut ON Signalement(statut);
CREATE INDEX idx_signalement_type_cible ON Signalement(type_cible, id_cible);


-- ============================================================================
-- TABLES DE LIAISON (relations N..N)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table : Utilisatrice_CentreInteret (RM-11)
-- ----------------------------------------------------------------------------
CREATE TABLE Utilisatrice_CentreInteret (
    id_utilisatrice         INTEGER NOT NULL,
    id_centre_interet       INTEGER NOT NULL,

    CONSTRAINT pk_user_interet
        PRIMARY KEY (id_utilisatrice, id_centre_interet),

    CONSTRAINT fk_uci_utilisatrice
        FOREIGN KEY (id_utilisatrice) REFERENCES Utilisatrice(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_uci_centre_interet
        FOREIGN KEY (id_centre_interet) REFERENCES CentreInteret(id)
        ON DELETE CASCADE
);

COMMENT ON TABLE Utilisatrice_CentreInteret IS 'Liaison N..N : chaque utilisatrice a 3 à 5 centres d''intérêt (RM-11)';

-- ----------------------------------------------------------------------------
-- Table : Post_Tag
-- ----------------------------------------------------------------------------
CREATE TABLE Post_Tag (
    id_post     INTEGER NOT NULL,
    id_tag      INTEGER NOT NULL,

    CONSTRAINT pk_post_tag
        PRIMARY KEY (id_post, id_tag),

    CONSTRAINT fk_pt_post
        FOREIGN KEY (id_post) REFERENCES Post(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pt_tag
        FOREIGN KEY (id_tag) REFERENCES Tag(id)
        ON DELETE CASCADE
);

COMMENT ON TABLE Post_Tag IS 'Liaison N..N : un post peut avoir plusieurs tags';


-- ============================================================================
-- DONNÉES DE RÉFÉRENCE (à insérer dès la création de la base)
-- ============================================================================

-- Les 8 centres d'intérêt fixes (RM-11)
INSERT INTO CentreInteret (nom, emoji) VALUES
    ('Restos',      '🍴'),
    ('Cinéma',      '🎬'),
    ('Shopping',    '🛍️'),
    ('Culture',     '🎨'),
    ('Sport',       '💪'),
    ('Bien-être',   '🌿'),
    ('Musique',     '🎵'),
    ('Voyages',     '✈️');

-- Les tags de base
INSERT INTO Tag (nom) VALUES
    ('Advice'),
    ('Outing'),
    ('Question'),
    ('Recommend');

-- Quelques villes françaises de départ
INSERT INTO Ville (nom, code_postal) VALUES
    ('Paris',       '75000'),
    ('Lyon',        '69000'),
    ('Marseille',   '13000'),
    ('Toulouse',    '31000'),
    ('Bordeaux',    '33000'),
    ('Nice',        '06000'),
    ('Nantes',      '44000'),
    ('Strasbourg',  '67000'),
    ('Montpellier', '34000'),
    ('Lille',       '59000');


-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
-- Vérification rapide après exécution :
-- SELECT COUNT(*) FROM Utilisatrice;          -- Doit retourner 0
-- SELECT * FROM CentreInteret;                -- Doit retourner les 8 catégories
-- SELECT * FROM Tag;                          -- Doit retourner les 4 tags
-- SELECT * FROM Ville;                        -- Doit retourner les 10 villes
-- ============================================================================
// ============================================================================
// SISTER SPACE — Tests de la route Auth
// ============================================================================

import request from 'supertest';
import app from '../src/app';
import pool from '../src/config/database';

// On utilisera ce timestamp pour créer des emails uniques
const timestamp = Date.now();

describe('🔐 Routes Auth', () => {

  // Nettoyer après tous les tests
  afterAll(async () => {
    // Supprimer les utilisatrices créées par les tests
    await pool.query(`DELETE FROM Utilisatrice WHERE email LIKE 'test-%@test.com'`);
    await pool.end(); // Fermer la connexion BDD
  });

  // ----- Tests d'inscription -----
  describe('POST /api/auth/register', () => {
    
    it('devrait créer une nouvelle utilisatrice avec succès', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-${timestamp}@test.com`,
          mot_de_passe: 'TestSister2026!',
          prenom: 'TestUser',
          pseudo: `@test_${timestamp}`,
          date_naissance: '1995-05-15',
          id_ville: 1,
          centres_interet: [1, 4, 5],
          identification_femme: true,
          acceptation_cgu: true,
          consentement_donnees: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(`test-${timestamp}@test.com`);
      expect(response.body.data.statut).toBe('EN_ATTENTE');
    });

    it('devrait refuser un email déjà utilisé', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-${timestamp}@test.com`, // Même email que précédemment
          mot_de_passe: 'TestSister2026!',
          prenom: 'Doublon',
          pseudo: `@test_doublon_${timestamp}`,
          date_naissance: '1995-05-15',
          id_ville: 1,
          centres_interet: [1, 4, 5],
          identification_femme: true,
          acceptation_cgu: true,
          consentement_donnees: true,
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('devrait refuser un mot de passe trop faible (RM-02)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-faible-${timestamp}@test.com`,
          mot_de_passe: 'abc',  // Trop court
          prenom: 'Faible',
          pseudo: `@test_faible_${timestamp}`,
          date_naissance: '1995-05-15',
          id_ville: 1,
          centres_interet: [1, 4, 5],
          identification_femme: true,
          acceptation_cgu: true,
          consentement_donnees: true,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait refuser sans acceptation des CGU (RGPD)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-cgu-${timestamp}@test.com`,
          mot_de_passe: 'TestSister2026!',
          prenom: 'NoCgu',
          pseudo: `@test_nocgu_${timestamp}`,
          date_naissance: '1995-05-15',
          id_ville: 1,
          centres_interet: [1, 4, 5],
          identification_femme: true,
          acceptation_cgu: false,  // Refusé
          consentement_donnees: true,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait refuser moins de 3 centres d\'intérêt (RM-11)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-interets-${timestamp}@test.com`,
          mot_de_passe: 'TestSister2026!',
          prenom: 'Interets',
          pseudo: `@test_interets_${timestamp}`,
          date_naissance: '1995-05-15',
          id_ville: 1,
          centres_interet: [1],  // Seulement 1
          identification_femme: true,
          acceptation_cgu: true,
          consentement_donnees: true,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ----- Tests de connexion -----
  describe('POST /api/auth/login', () => {
    
    it('devrait refuser un compte EN_ATTENTE', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: `test-${timestamp}@test.com`,
          mot_de_passe: 'TestSister2026!',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('devrait refuser un mot de passe incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: `test-${timestamp}@test.com`,
          mot_de_passe: 'MauvaisMotDePasse!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('devrait refuser un email inexistant', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inexistant@nimporte.com',
          mot_de_passe: 'TestSister2026!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // ----- Tests de la route protégée /me -----
  describe('GET /api/auth/me', () => {
    
    it('devrait refuser sans token', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.status).toBe(401);
    });

    it('devrait refuser avec un token invalide', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token_bidon');
      
      expect(response.status).toBe(401);
    });
  });
});
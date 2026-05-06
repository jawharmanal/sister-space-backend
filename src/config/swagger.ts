// ============================================================================
// SISTER SPACE — Configuration Swagger / OpenAPI
// ============================================================================

import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🌸 Sister Space API',
      version: '1.0.0',
      description: `
        API REST du réseau social Sister Space.
        
        **Authentification** : la plupart des routes nécessitent un token JWT 
        à passer dans le header \`Authorization: Bearer <token>\`.
        
        **Pour obtenir un token** : utilisez la route \`POST /api/auth/login\`.
      `,
      contact: {
        name: 'Manal — Projet RNCP CDA',
        email: 'jawhar.manal69@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement local',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Inscription, connexion, profil' },
      { name: 'Posts', description: 'Publications du fil d\'actualité' },
      { name: 'Utilisatrices', description: 'Gestion des utilisatrices' },
      { name: 'Admin', description: 'Routes réservées aux administratrices' },
      { name: 'Conversations', description: 'Messagerie privée' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via /api/auth/login',
        },
      },
      schemas: {
        Utilisatrice: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 22 },
            email: { type: 'string', example: 'manal@email.com' },
            prenom: { type: 'string', example: 'Manal' },
            pseudo: { type: 'string', example: '@manal_dev' },
            statut: { type: 'string', enum: ['EN_ATTENTE', 'ACTIF', 'REFUSE', 'BANNI'] },
            role: { type: 'string', enum: ['UTILISATRICE', 'ADMIN'] },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            contenu: { type: 'string', example: '🌸 Mon premier post !' },
            id_auteure: { type: 'integer', example: 22 },
            auteure_prenom: { type: 'string', example: 'Manal' },
            nb_likes: { type: 'string', example: '5' },
            nb_commentaires: { type: 'string', example: '2' },
            date_creation: { type: 'string', format: 'date-time' },
          },
        },
        ErreurReponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Description de l\'erreur' },
          },
        },
      },
    },
  },
  // Où chercher les commentaires JSDoc
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
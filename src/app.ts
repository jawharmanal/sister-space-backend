// ============================================================================
// SISTER SPACE — Configuration de l'application Express
// (séparée du démarrage pour faciliter les tests)
// ============================================================================

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import utilisatriceRoutes from './routes/utilisatrice.routes';
import postRoutes from './routes/post.routes';
import adminRoutes from './routes/admin.routes';
import messageRoutes from './routes/message.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
dotenv.config();

const app = express();

// Middlewares
const corsOptions = {
  origin: [
    'http://localhost:5173',  // pour ton dev local
    'https://sister-space-frontend.vercel.app',  // ton front Vercel
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🌸 Bienvenue sur l\'API Sister Space !',
    status: 'OK',
    version: '1.0.0',
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/utilisatrices', utilisatriceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/conversations', messageRoutes);
// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: '🌸 Sister Space API Docs',
  customCss: '.swagger-ui .topbar { background-color: #DB2777; }',
}));

export default app;
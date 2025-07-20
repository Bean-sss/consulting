/**
 * Main server entry point for the Defense RFP Platform
 * Provides AI-powered RFP analysis and vendor compatibility scoring
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Route imports
import uploadRoute from './routes/uploadRoute';
import scoreRoute from './routes/scoreRoute';
import vendorRoute from './routes/vendorRoute';
import rfpRoute from './routes/rfpRoute';
import notificationRoute from './routes/notificationRoute';

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Validate required environment variables
function validateEnvironment() {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
}

// Initialize Express application
function createApp() {
  const app = express();

  // Middleware setup
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  return app;
}

// Setup API routes
function setupRoutes(app: express.Application) {
  // Core API routes
  app.use('/api', uploadRoute);
  app.use('/api', scoreRoute);
  app.use('/api', vendorRoute);
  app.use('/api', rfpRoute);
  app.use('/api', notificationRoute);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Defense RFP Platform API'
    });
  });
}

// Start the server
function startServer() {
  validateEnvironment();
  
  const app = createApp();
  setupRoutes(app);
  
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Defense RFP Platform API server running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  });
}

// Initialize the application
startServer();

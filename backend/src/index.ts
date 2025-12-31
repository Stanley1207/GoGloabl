import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import apiRouter from './routes/api.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// 🔥 关键修复：确保从正确的路径加载 .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Validate required environment variables
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('❌ Error: DEEPSEEK_API_KEY is not set in environment variables');
  console.error('Please create a .env file with your DeepSeek API key');
  console.error(`Looking for .env at: ${join(__dirname, '../.env')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    service: 'GOGLOBAL Market Analysis API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      analyze: 'POST /api/analyze'
    },
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 GOGLOBAL Market Analysis Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✓ Server running on: http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Frontend URL: ${FRONTEND_URL}`);
  console.log(`✓ API Key configured: ${process.env.DEEPSEEK_API_KEY ? '✓' : '✗'}`);
  if (process.env.DEEPSEEK_API_KEY) {
    console.log(`✓ API Key preview: ${process.env.DEEPSEEK_API_KEY.substring(0, 8)}...`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Available endpoints:');
  console.log(`  GET  /              - API information`);
  console.log(`  GET  /api/health    - Health check`);
  console.log(`  POST /api/analyze   - Market analysis`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});
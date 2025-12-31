import express, { Request, Response } from 'express';
import { analyzeProduct } from '../services/deepseek.js';
import type { AnalysisRequest, AnalysisResponse, ProductData } from '../types.js';

const router = express.Router();

// Rate limiting state (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '10', 10);
  const windowMs = 60 * 1000; // 1 minute

  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'GOGLOBAL Market Analysis API'
  });
});

// Product analysis endpoint
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    // Rate limiting
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        timestamp: new Date().toISOString()
      } as AnalysisResponse);
      return;
    }

    // Validate request body
    const { productData }: AnalysisRequest = req.body;

    if (!productData) {
      res.status(400).json({
        success: false,
        error: 'Missing productData in request body',
        timestamp: new Date().toISOString()
      } as AnalysisResponse);
      return;
    }

    // Validate required fields
    const requiredFields: (keyof ProductData)[] = [
      'productName',
      'category',
      'description',
      'targetMarkets',
      'currentMarket'
    ];

    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        timestamp: new Date().toISOString()
      } as AnalysisResponse);
      return;
    }

    if (!Array.isArray(productData.targetMarkets) || productData.targetMarkets.length === 0) {
      res.status(400).json({
        success: false,
        error: 'targetMarkets must be a non-empty array',
        timestamp: new Date().toISOString()
      } as AnalysisResponse);
      return;
    }

    // Log the analysis request
    console.log(`[${new Date().toISOString()}] Analysis request for:`, {
      product: productData.productName,
      markets: productData.targetMarkets,
      ip: clientIp
    });

    // Perform the analysis
    const markets = await analyzeProduct(productData);

    // Return successful response
    const response: AnalysisResponse = {
      success: true,
      data: { markets },
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Analysis error:', error);
    
    const response: AnalysisResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };

    res.status(500).json(response);
  }
});

// Test endpoint to verify API connectivity (development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test', async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Test endpoint working',
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  });
}

export default router;

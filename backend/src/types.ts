// Product data structure from frontend
export interface ProductData {
  productName: string;
  category: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  targetMarkets: string[];
  currentMarket: string;
  productionCapacity: string;
  certifications: string;
  shelfLife: string;
  experience: string;
}

// Analysis request structure
export interface AnalysisRequest {
  productData: ProductData;
}

// Market analysis result for a single market
export interface MarketAnalysis {
  market: string;
  overallScore: number;
  recommendation: 'strongly-recommended' | 'recommended' | 'consider-carefully' | 'not-recommended';
  
  // Detailed scores
  scores: {
    legalCompliance: number;      // 0-100
    competitiveAnalysis: number;  // 0-100
    marketDemand: number;         // 0-100
    pricingStrategy: number;      // 0-100
    culturalAdaptation: number;   // 0-100
  };
  
  // Detailed analysis
  legalCompliance: {
    score: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    regulations: string[];
    certifications: string[];
    labelingRequirements: string[];
    prohibitions: string[];
  };
  
  competitiveAnalysis: {
    score: number;
    competitors: Array<{
      name: string;
      priceRange: string;
      marketShare?: string;
    }>;
    competitionIntensity: 'Low' | 'Medium' | 'High';
    marketShareDistribution: string;
  };
  
  marketDemand: {
    score: number;
    marketSize: string;
    growthTrend: string;
    consumerPreferences: string[];
    seasonalFactors: string[];
  };
  
  pricingStrategy: {
    score: number;
    recommendedPriceRange: {
      min: number;
      max: number;
      currency: string;
    };
    tariffEstimate: string;
    logisticsCost: string;
    profitMargin: string;
  };
  
  culturalAdaptation: {
    score: number;
    localizationRequirements: string[];
    culturalConsiderations: string[];
    marketingRecommendations: string[];
  };
  
  // Summary sections
  keyFindings: string[];
  actionItems: string[];
  riskAlerts: string[];
  
  // Metadata
  sources: string[];
  lastUpdated: string;
}

// Complete analysis response
export interface AnalysisResponse {
  success: boolean;
  data?: {
    markets: Record<string, MarketAnalysis>;
  };
  error?: string;
  timestamp: string;
}

// DeepSeek API types
export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

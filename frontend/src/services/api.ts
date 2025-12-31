// frontend/src/services/api.ts
import type { ProductData } from '../app/App';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface MarketAnalysis {
  market: string;
  overallScore: number;
  recommendation: 'strongly-recommended' | 'recommended' | 'consider-carefully' | 'not-recommended';
  scores: {
    legalCompliance: number;
    competitiveAnalysis: number;
    marketDemand: number;
    pricingStrategy: number;
    culturalAdaptation: number;
  };
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
  keyFindings: string[];
  actionItems: string[];
  riskAlerts: string[];
  sources: string[];
  lastUpdated: string;
}

/**
 * Check if backend API is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * Analyze product for market expansion
 */
export async function analyzeProduct(
  productData: ProductData
): Promise<Record<string, MarketAnalysis>> {
  try {
    console.log('Sending analysis request to:', `${API_BASE_URL}/api/analyze`);
    console.log('Product data:', productData);

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `API request failed with status ${response.status}`
      );
    }

    const result = await response.json();
    console.log('Analysis result:', result);

    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }

    return result.data.markets;
  } catch (error) {
    console.error('Product analysis error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Cannot connect to backend server. Please make sure the server is running on ' + API_BASE_URL
      );
    }
    
    throw error;
  }
}

/**
 * Helper function to format recommendation text
 */
export function getRecommendationText(
  recommendation: MarketAnalysis['recommendation']
): string {
  const map = {
    'strongly-recommended': 'GO - Strongly Recommended',
    'recommended': 'GO - Recommended',
    'consider-carefully': 'CAUTION - Consider Carefully',
    'not-recommended': 'NO-GO - Not Recommended',
  };
  return map[recommendation] || recommendation;
}

/**
 * Helper function to get score color class
 */
export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}
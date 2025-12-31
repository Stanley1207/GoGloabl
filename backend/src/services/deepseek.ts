import type { ProductData, MarketAnalysis, DeepSeekRequest, DeepSeekResponse } from '../types.js';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

/**
 * Build the analysis prompt for a specific market
 */
function buildPrompt(productData: ProductData, market: string): string {
  return `You are a professional international market expansion analyst. Please provide a detailed market entry feasibility analysis report based on the following product information.

### Input Information:
- **Product Name**: ${productData.productName}
- **Product Category**: ${productData.category}
- **Product Description**: ${productData.description}
- **Target Market**: ${market}
- **Price Range**: $${productData.costPrice} - $${productData.sellingPrice}
- **Current Market**: ${productData.currentMarket}
- **Production Capacity**: ${productData.productionCapacity}
- **Existing Certifications**: ${productData.certifications || 'None'}
- **Shelf Life**: ${productData.shelfLife || 'N/A'}
- **Export Experience**: ${productData.experience}

### Analysis Requirements:
Please generate a comprehensive market entry analysis report following this structure:

#### 1. Legal & Regulatory Compliance Analysis (Weight: 30%)
- Research and analyze import regulations for ${productData.category} in ${market}
- Product certification requirements (e.g., CE, FDA, CCC, etc.)
- Labeling and packaging regulations
- Prohibited or restricted items clauses
- **Compliance Score**: [0-100]
- **Risk Level**: Low/Medium/High

#### 2. Competitive Market Analysis (Weight: 25%)
- Identify major competitors for similar products in ${market} (at least 3-5)
- Competitor price range comparison
- Market share distribution
- Competition intensity assessment
- **Competitiveness Score**: [0-100]

#### 3. Market Demand & Potential (Weight: 20%)
- Market size for this product category in ${market}
- Growth trends and forecasts
- Consumer preferences and purchasing behaviors
- Seasonal factors
- **Market Potential Score**: [0-100]

#### 4. Pricing Strategy Recommendations (Weight: 15%)
- Recommended pricing range based on competitor analysis
- Tariff and logistics cost estimates
- Profit margin analysis
- **Price Competitiveness Score**: [0-100]

#### 5. Cultural & Localization Adaptation (Weight: 10%)
- Product localization requirements
- Cultural taboos or sensitivities
- Marketing strategy recommendations
- **Adaptation Score**: [0-100]

### Output Format:
Please respond with a valid JSON object following this exact structure:

{
  "market": "${market}",
  "overallScore": 85,
  "recommendation": "recommended",
  "scores": {
    "legalCompliance": 75,
    "competitiveAnalysis": 82,
    "marketDemand": 90,
    "pricingStrategy": 78,
    "culturalAdaptation": 85
  },
  "legalCompliance": {
    "score": 75,
    "riskLevel": "Medium",
    "regulations": ["regulation 1", "regulation 2"],
    "certifications": ["cert 1", "cert 2"],
    "labelingRequirements": ["requirement 1"],
    "prohibitions": ["prohibition 1"]
  },
  "competitiveAnalysis": {
    "score": 82,
    "competitors": [
      {"name": "Competitor A", "priceRange": "$10-$20", "marketShare": "25%"}
    ],
    "competitionIntensity": "Medium",
    "marketShareDistribution": "Top 3 players control 60% of market"
  },
  "marketDemand": {
    "score": 90,
    "marketSize": "$500M annually",
    "growthTrend": "Growing at 8% YoY",
    "consumerPreferences": ["preference 1", "preference 2"],
    "seasonalFactors": ["factor 1"]
  },
  "pricingStrategy": {
    "score": 78,
    "recommendedPriceRange": {
      "min": 15,
      "max": 25,
      "currency": "USD"
    },
    "tariffEstimate": "10-15% import duty",
    "logisticsCost": "$2-3 per unit",
    "profitMargin": "30-40%"
  },
  "culturalAdaptation": {
    "score": 85,
    "localizationRequirements": ["requirement 1"],
    "culturalConsiderations": ["consideration 1"],
    "marketingRecommendations": ["recommendation 1"]
  },
  "keyFindings": [
    "Finding 1",
    "Finding 2",
    "Finding 3"
  ],
  "actionItems": [
    "Action 1",
    "Action 2",
    "Action 3"
  ],
  "riskAlerts": [
    "Risk 1",
    "Risk 2"
  ],
  "sources": [
    "Source 1",
    "Source 2"
  ],
  "lastUpdated": "${new Date().toISOString()}"
}

### Important Notes:
1. All data and information must cite sources
2. Price information must include currency and date updated
3. Regulatory information must reference official sources
4. If certain information is unavailable, clearly state this and provide alternative suggestions
5. Ensure the JSON is valid and properly formatted
6. Use "strongly-recommended" (90-100), "recommended" (70-89), "consider-carefully" (50-69), or "not-recommended" (below 50) for the recommendation field`;
}

/**
 * Call DeepSeek API to analyze a single market
 */
export async function analyzeMarket(
  productData: ProductData,
  market: string
): Promise<MarketAnalysis> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  const prompt = buildPrompt(productData, market);

  const requestBody: DeepSeekRequest = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' }
  };

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in DeepSeek response');
    }

    // Parse the JSON response
    const analysis: MarketAnalysis = JSON.parse(content);

    // Validate the response structure
    if (!analysis.market || typeof analysis.overallScore !== 'number') {
      throw new Error('Invalid response structure from DeepSeek');
    }

    return analysis;

  } catch (error) {
    console.error(`Error analyzing market ${market}:`, error);
    
    // Return a fallback error response
    return {
      market,
      overallScore: 0,
      recommendation: 'not-recommended',
      scores: {
        legalCompliance: 0,
        competitiveAnalysis: 0,
        marketDemand: 0,
        pricingStrategy: 0,
        culturalAdaptation: 0
      },
      legalCompliance: {
        score: 0,
        riskLevel: 'High',
        regulations: ['Error: Unable to fetch regulatory information'],
        certifications: [],
        labelingRequirements: [],
        prohibitions: []
      },
      competitiveAnalysis: {
        score: 0,
        competitors: [],
        competitionIntensity: 'High',
        marketShareDistribution: 'Unknown'
      },
      marketDemand: {
        score: 0,
        marketSize: 'Unknown',
        growthTrend: 'Unknown',
        consumerPreferences: [],
        seasonalFactors: []
      },
      pricingStrategy: {
        score: 0,
        recommendedPriceRange: {
          min: 0,
          max: 0,
          currency: 'USD'
        },
        tariffEstimate: 'Unknown',
        logisticsCost: 'Unknown',
        profitMargin: 'Unknown'
      },
      culturalAdaptation: {
        score: 0,
        localizationRequirements: [],
        culturalConsiderations: [],
        marketingRecommendations: []
      },
      keyFindings: ['Analysis failed. Please try again later.'],
      actionItems: ['Contact support if the issue persists.'],
      riskAlerts: ['Unable to complete market analysis due to technical error.'],
      sources: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Analyze product for multiple markets
 */
export async function analyzeProduct(productData: ProductData): Promise<Record<string, MarketAnalysis>> {
  const results: Record<string, MarketAnalysis> = {};

  // Analyze each target market sequentially to avoid rate limits
  for (const market of productData.targetMarkets) {
    console.log(`Analyzing market: ${market}`);
    results[market] = await analyzeMarket(productData, market);
    
    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

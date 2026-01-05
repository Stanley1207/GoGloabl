import type { ProductData, MarketAnalysis, GeminiRequest, GeminiResponse } from '../types.js';

/**
 * 获取 Gemini API 配置（延迟读取）
 */
function getApiConfig() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
  
  if (!apiKey) {
    console.error('\n❌ GEMINI_API_KEY not found in environment');
    console.error('📋 Current environment variables containing "GEMINI":');
    const geminiVars = Object.keys(process.env).filter(k => k.includes('GEMINI'));
    if (geminiVars.length > 0) {
      geminiVars.forEach(k => console.error(`   ${k}: ${process.env[k]?.substring(0, 10)}...`));
    } else {
      console.error('   (none found)');
    }
    console.error('\n💡 This usually means:');
    console.error('   1. .env file is missing or in wrong location');
    console.error('   2. .env file doesn\'t have GEMINI_API_KEY');
    console.error('   3. Server needs to be restarted');
    console.error('\n📝 Get your API key at: https://makersuite.google.com/app/apikey\n');
    
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  return { apiKey, model };
}

/**
 * Build the analysis prompt for a specific market
 */
function buildPrompt(productData: ProductData, market: string): string {
  return `You are a senior international trade and market expansion consultant with expertise in helping businesses expand into ${market}. Provide a detailed feasibility analysis for market entry.

### 📦 Product Information:
- **Product Name**: ${productData.productName}
- **Product Category**: ${productData.category}
- **Product Description**: ${productData.description}
- **Target Market**: ${market}
- **Cost Price**: $${productData.costPrice} USD
- **Target Selling Price**: $${productData.sellingPrice} USD
- **Current Market**: ${productData.currentMarket}
- **Production Capacity**: ${productData.productionCapacity}
- **Existing Certifications**: ${productData.certifications || 'None'}
- **Shelf Life**: ${productData.shelfLife || 'N/A'}
- **Export Experience**: ${productData.experience}

---

### 📊 Analysis Requirements:

Please analyze the **${market}** market across the following 5 dimensions. Provide a score (0-100) for each dimension:

#### 1️⃣ Legal & Regulatory Compliance (Weight: 30%)
Analyze specific regulations for **${productData.category}** products entering **${market}**:
- Import regulations and customs requirements
- Required product certifications (e.g., CE for EU, FDA for US, CCC for China)
- Labeling and packaging requirements
- Prohibited or restricted items
- Timeline for compliance (estimated months)
- **Risk Level**: Low/Medium/High
- **Compliance Score**: 0-100

#### 2️⃣ Competitive Landscape (Weight: 25%)
Identify and analyze the competitive environment in **${market}**:
- Major competitors selling similar products (list at least 3-5 specific companies)
- Competitor pricing ranges (with currency)
- Market share distribution
- Competition intensity assessment
- Market entry barriers
- **Competitiveness Score**: 0-100

#### 3️⃣ Market Demand & Potential (Weight: 20%)
Evaluate market size and growth potential for **${productData.category}** in **${market}**:
- Current market size (with specific figures and currency)
- Growth trends and forecasts (with percentages and timeframes)
- Consumer preferences and buying behaviors
- Seasonal factors
- Key distribution channels
- **Market Demand Score**: 0-100

#### 4️⃣ Pricing Strategy (Weight: 15%)
Develop a competitive pricing strategy:
- Recommended price range based on competitor analysis
- Import duties and tariff estimates (with percentages)
- Logistics and shipping cost estimates
- Gross profit margin analysis
- Break-even analysis
- **Pricing Competitiveness Score**: 0-100

#### 5️⃣ Cultural & Localization Fit (Weight: 10%)
Assess cultural adaptation requirements:
- Product localization needs (language, packaging, sizing)
- Cultural sensitivities or taboos
- Marketing and positioning recommendations
- Local partnership opportunities
- **Adaptation Score**: 0-100

---

### 🎯 Output Format Requirements:

Return ONLY a valid JSON object (do NOT include markdown code block markers):

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
    "regulations": [
      "EU Food Safety Regulation (EC) No 178/2002 requires all food products to be traceable",
      "Organic certification requires EU Organic Regulation (EC) No 834/2007 compliance"
    ],
    "certifications": [
      "CE marking required for consumer products",
      "Organic certification from EU-recognized body"
    ],
    "labelingRequirements": [
      "Multi-language labels (English + local language)",
      "Nutritional information in standardized format",
      "Origin country clearly marked"
    ],
    "prohibitions": [
      "No products containing banned additives (see EU Regulation 1333/2008)"
    ],
    "complianceTimeline": "6-9 months for full certification"
  },
  "competitiveAnalysis": {
    "score": 82,
    "competitors": [
      {
        "name": "Twinings Tea (Unilever)",
        "priceRange": "$4.99-$8.99 per 20-bag box",
        "marketShare": "23%",
        "strengths": "Strong brand recognition, wide distribution"
      },
      {
        "name": "Harney & Sons",
        "priceRange": "$7.99-$12.99 per 20-bag box",
        "marketShare": "8%",
        "strengths": "Premium positioning, specialty flavors"
      },
      {
        "name": "Traditional Medicinals",
        "priceRange": "$5.99-$9.99 per 16-bag box",
        "marketShare": "12%",
        "strengths": "Organic focus, health-oriented"
      }
    ],
    "competitionIntensity": "High",
    "marketShareDistribution": "Top 5 brands control 65% of market; strong brand loyalty exists",
    "entryBarriers": "High - requires significant marketing investment and retail partnerships"
  },
  "marketDemand": {
    "score": 90,
    "marketSize": "$2.3 billion USD annually (2024)",
    "growthTrend": "Growing at 7.2% CAGR (2024-2029)",
    "consumerPreferences": [
      "Increasing demand for organic and sustainably-sourced products",
      "Preference for premium, specialty teas over commodity products",
      "Health and wellness benefits are key purchase drivers"
    ],
    "seasonalFactors": [
      "Peak sales in Q4 (holiday season)",
      "20% sales increase during cold weather months"
    ],
    "distributionChannels": [
      "Supermarkets (45%)",
      "Specialty stores (25%)",
      "Online retail (20%)",
      "Food service (10%)"
    ]
  },
  "pricingStrategy": {
    "score": 78,
    "recommendedPriceRange": {
      "min": ${Math.round(productData.sellingPrice * 0.85)},
      "max": ${Math.round(productData.sellingPrice * 1.15)},
      "currency": "USD",
      "rationale": "Positioned between mass-market and premium tiers"
    },
    "tariffEstimate": "Import duty: 6.4% for tea products under HS code 0902",
    "logisticsCost": "$1.20-$1.80 per unit (including shipping, warehousing, distribution)",
    "profitMargin": "Estimated 35-42% gross margin after all costs",
    "breakEvenAnalysis": "Need to sell approximately 15,000 units in first year to break even"
  },
  "culturalAdaptation": {
    "score": 85,
    "localizationRequirements": [
      "Packaging should emphasize organic/natural aspects (key value in ${market})",
      "Consider smaller package sizes (European preference)",
      "Multi-language packaging required for EU markets"
    ],
    "culturalConsiderations": [
      "Strong preference for ethically-sourced products",
      "Sustainability credentials are important purchase factors",
      "Health claims must comply with EU Nutrition and Health Claims Regulation"
    ],
    "marketingRecommendations": [
      "Partner with health food stores and wellness influencers",
      "Emphasize origin story and farming practices",
      "Leverage digital marketing and e-commerce platforms",
      "Consider participating in organic/natural product trade shows"
    ]
  },
  "keyFindings": [
    "${market} shows strong demand for organic ${productData.category} with 7.2% annual growth",
    "Main competitors price ${productData.category} in the $5-$13 range, leaving room for competitive positioning",
    "EU organic certification required - estimated 6-9 months to obtain",
    "Strong e-commerce opportunity with 20% of market shifting online",
    "Import duties of 6.4% are manageable within target margins"
  ],
  "actionItems": [
    "PRIORITY: Begin EU organic certification process immediately (6-9 month timeline)",
    "Conduct packaging redesign for EU labeling requirements",
    "Establish relationships with organic food distributors in ${market}",
    "Recommended retail price: $${Math.round(productData.sellingPrice * 0.9)}-$${Math.round(productData.sellingPrice * 1.1)} to compete effectively",
    "Budget $50,000-$75,000 for initial market entry costs",
    "Consider attending BioFach trade show to meet buyers"
  ],
  "riskAlerts": [
    "HIGH PRIORITY: Organic certification required - budget $5,000-$10,000 and allow 6-9 months",
    "Competition is intense; differentiation strategy is critical",
    "Retail distribution requires minimum order quantities and long payment terms",
    "Brexit may affect UK market access differently than EU markets"
  ],
  "opportunities": [
    "Growing consumer interest in sustainably-sourced products aligns with product positioning",
    "E-commerce channel growing 15% annually - lower barrier to entry",
    "Premium pricing acceptable if quality and story are communicated effectively"
  ],
  "sources": [
    "Euromonitor International - Tea Market in ${market} 2024",
    "EU Food Safety Authority (EFSA) regulations database",
    "WTO Tariff Database - HS Code 0902",
    "${market} Customs Authority official website",
    "Statista Market Research - Organic Food Industry"
  ],
  "lastUpdated": "${new Date().toISOString()}"
}

---

### ⚠️ Critical Requirements:

1. **Data Quality**: Base all analysis on realistic market conditions and publicly available information
2. **Specificity**: Include specific company names, exact price ranges with currency, and concrete figures
3. **Official Sources**: Reference official regulations by their regulation numbers (e.g., "EU Regulation 178/2002")
4. **Transparency**: If certain information is unavailable, clearly state this and provide alternative recommendations
5. **JSON Validity**: Ensure the JSON is perfectly formatted and can be parsed directly
6. **Recommendation Mapping**:
   - "strongly-recommended" = 90-100 points
   - "recommended" = 70-89 points
   - "consider-carefully" = 50-69 points
   - "not-recommended" = below 50 points
7. **Actionable Insights**: All recommendations must be specific and actionable, not generic advice
8. **Currency**: Always specify currency for all monetary values
9. **Timeframes**: Include estimated timeframes for certifications and market entry steps
10. **Real Companies**: When listing competitors, use real company names when possible

---

### 🎯 Scoring Guidelines:

**Legal Compliance (0-100):**
- 90-100: Minimal barriers, simple registration
- 70-89: Moderate requirements, standard certifications needed
- 50-69: Significant regulatory hurdles, time-intensive
- 0-49: Major barriers, prohibited/restricted products

**Competitive Analysis (0-100):**
- 90-100: Low competition, high differentiation opportunity
- 70-89: Moderate competition, clear positioning strategy exists
- 50-69: High competition, differentiation challenging
- 0-49: Saturated market, no clear competitive advantage

**Market Demand (0-100):**
- 90-100: Large market, strong growth, high demand
- 70-89: Good market size, stable growth
- 50-69: Limited market, slow growth
- 0-49: Small/declining market, low demand

**Pricing Strategy (0-100):**
- 90-100: Excellent margins, competitive pricing advantage
- 70-89: Good margins, competitive pricing
- 50-69: Thin margins, pricing pressure
- 0-49: Unprofitable, cannot compete on price

**Cultural Adaptation (0-100):**
- 90-100: Minimal adaptation needed, strong cultural fit
- 70-89: Moderate localization, manageable
- 50-69: Significant adaptation required
- 0-49: Major cultural barriers, extensive changes needed`;
}

/**
 * Call Gemini API to analyze a single market
 */
export async function analyzeMarket(
  productData: ProductData,
  market: string
): Promise<MarketAnalysis> {
  const { apiKey, model } = getApiConfig();
  const prompt = buildPrompt(productData, market);

  // Gemini API endpoint
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Gemini request format
  const requestBody: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "application/json"
    }
  };

  try {
    console.log(`[Gemini] Analyzing ${market}...`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Gemini] API error for ${market}:`, response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content in Gemini response');
    }

    // Parse the JSON response
    let analysis: MarketAnalysis;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error(`[Gemini] Failed to parse JSON for ${market}:`, content);
      throw new Error('Invalid JSON response from Gemini');
    }

    // Validate the response structure
    if (!analysis.market || typeof analysis.overallScore !== 'number') {
      throw new Error('Invalid response structure from Gemini');
    }

    console.log(`[Gemini] ✓ Successfully analyzed ${market} (score: ${analysis.overallScore})`);
    return analysis;

  } catch (error) {
    console.error(`[Gemini] Error analyzing market ${market}:`, error);
    
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
      keyFindings: [`Analysis failed for ${market}. Please try again later.`],
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

  console.log(`[Gemini] Starting analysis for ${productData.targetMarkets.length} markets`);

  // Analyze each target market sequentially to avoid rate limits
  for (const market of productData.targetMarkets) {
    results[market] = await analyzeMarket(productData, market);
    
    // Add a small delay between requests to avoid rate limiting
    if (productData.targetMarkets.indexOf(market) < productData.targetMarkets.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`[Gemini] ✓ Completed analysis for all markets`);
  return results;
}

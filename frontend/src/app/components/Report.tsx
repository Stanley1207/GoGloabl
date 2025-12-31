import { useMemo } from 'react';
import { ProductData } from '../App';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Shield, 
  Truck, 
  DollarSign,
  Globe,
  BarChart3,
  FileText,
  ArrowLeft
} from 'lucide-react';

interface ReportProps {
  productData: ProductData;
  onStartOver: () => void;
}

interface MarketAnalysis {
  market: string;
  score: number;
  recommendation: 'go' | 'caution' | 'no-go';
  factors: {
    marketDemand: number;
    competition: number;
    regulatory: number;
    logistics: number;
    profitability: number;
    culturalFit: number;
  };
  factorReasons: {
    marketDemand: string[];
    competition: string[];
    regulatory: string[];
    logistics: string[];
    profitability: string[];
    culturalFit: string[];
  };
  costBreakdown: {
    manufacturingCost: number;
    shippingAndDuties: number;
    platformFees: number;
    marketingCAC: number;
    netProfit: number;
  };
  breakEvenUnits: number;
  insights: string[];
  risks: string[];
  opportunities: string[];
}

function analyzeMarket(market: string, productData: ProductData): MarketAnalysis {
  // Calculate profit margin
  const profitMargin = ((productData.sellingPrice - productData.costPrice) / productData.sellingPrice) * 100;
  
  // Scoring logic based on various factors
  const getMarketDemandScore = () => {
    const highDemandCategories = ['Electronics', 'Beauty & Cosmetics', 'Health & Wellness', 'Fashion & Apparel'];
    const highDemandMarkets = ['United States', 'China', 'Japan', 'Germany', 'United Kingdom'];
    
    let score = 60;
    if (highDemandCategories.includes(productData.category)) score += 15;
    if (highDemandMarkets.includes(market)) score += 15;
    if (productData.description.toLowerCase().includes('organic') || 
        productData.description.toLowerCase().includes('sustainable')) score += 10;
    
    return Math.min(score, 100);
  };

  const getCompetitionScore = () => {
    const saturatedCategories = ['Electronics', 'Fashion & Apparel'];
    const saturatedMarkets = ['United States', 'China', 'United Kingdom'];
    
    let score = 75;
    if (saturatedCategories.includes(productData.category)) score -= 20;
    if (saturatedMarkets.includes(market)) score -= 15;
    if (productData.experience === 'Extensive (6+ markets)') score += 10;
    
    return Math.max(score, 30);
  };

  const getRegulatoryScore = () => {
    const strictMarkets = ['United States', 'European Union', 'Japan', 'Australia'];
    const regulatedCategories = ['Food & Beverage', 'Health & Wellness', 'Beauty & Cosmetics'];
    
    let score = 70;
    if (strictMarkets.some(m => market.includes(m))) score -= 15;
    if (regulatedCategories.includes(productData.category)) score -= 20;
    if (productData.certifications && productData.certifications.length > 10) score += 20;
    
    return Math.max(score, 25);
  };

  const getLogisticsScore = () => {
    const nearMarkets = ['Canada', 'Mexico'];
    const distantMarkets = ['Australia', 'Singapore', 'Japan', 'South Korea'];
    const perishableCategories = ['Food & Beverage'];
    
    let score = 65;
    if (nearMarkets.includes(market)) score += 20;
    if (distantMarkets.includes(market)) score -= 10;
    if (perishableCategories.includes(productData.category) && !productData.shelfLife) score -= 25;
    if (productData.productionCapacity.includes('Large') || productData.productionCapacity.includes('Very Large')) {
      score += 10;
    }
    
    return Math.max(score, 30);
  };

  const getProfitabilityScore = () => {
    let score = 50;
    if (profitMargin > 50) score += 30;
    else if (profitMargin > 30) score += 20;
    else if (profitMargin > 15) score += 10;
    else if (profitMargin < 10) score -= 20;
    
    // Add premium for higher price points
    if (productData.sellingPrice > 100) score += 10;
    
    return Math.max(score, 20);
  };

  const getCulturalFitScore = () => {
    const westernMarkets = ['United States', 'United Kingdom', 'Canada', 'Australia'];
    const asianMarkets = ['Japan', 'South Korea', 'Singapore', 'China'];
    const luxuryCategories = ['Beauty & Cosmetics', 'Fashion & Apparel'];
    
    let score = 60;
    if (westernMarkets.includes(market)) score += 15;
    if (asianMarkets.includes(market) && luxuryCategories.includes(productData.category)) score += 15;
    if (productData.experience !== 'No prior export experience') score += 10;
    
    return Math.min(score, 100);
  };

  const factors = {
    marketDemand: getMarketDemandScore(),
    competition: getCompetitionScore(),
    regulatory: getRegulatoryScore(),
    logistics: getLogisticsScore(),
    profitability: getProfitabilityScore(),
    culturalFit: getCulturalFitScore()
  };

  // Factor reasons
  const factorReasons = {
    marketDemand: [] as string[],
    competition: [] as string[],
    regulatory: [] as string[],
    logistics: [] as string[],
    profitability: [] as string[],
    culturalFit: [] as string[]
  };

  // Market Demand reasons
  const highDemandCategories = ['Electronics', 'Beauty & Cosmetics', 'Health & Wellness', 'Fashion & Apparel'];
  const highDemandMarkets = ['United States', 'China', 'Japan', 'Germany', 'United Kingdom'];
  if (highDemandCategories.includes(productData.category)) {
    factorReasons.marketDemand.push(`${productData.category} shows strong consumer growth trends`);
  }
  if (highDemandMarkets.includes(market)) {
    factorReasons.marketDemand.push(`${market} has high purchasing power for this category`);
  }
  if (productData.description.toLowerCase().includes('organic') || productData.description.toLowerCase().includes('sustainable')) {
    factorReasons.marketDemand.push('Eco-conscious products are increasingly valued by consumers');
  }
  if (factorReasons.marketDemand.length === 0) {
    factorReasons.marketDemand.push('Baseline market demand exists for this product type');
  }

  // Competition reasons
  const saturatedCategories = ['Electronics', 'Fashion & Apparel'];
  const saturatedMarkets = ['United States', 'China', 'United Kingdom'];
  if (saturatedCategories.includes(productData.category) || saturatedMarkets.includes(market)) {
    factorReasons.competition.push('Market has established players requiring differentiation');
  } else {
    factorReasons.competition.push('Competitive landscape is favorable with room for new entrants');
  }
  if (productData.experience === 'Extensive (6+ markets)') {
    factorReasons.competition.push('Your export experience provides competitive advantage');
  }
  if (factorReasons.competition.length === 1) {
    factorReasons.competition.push('Pricing and brand positioning will be crucial factors');
  }

  // Regulatory reasons
  const strictMarkets = ['United States', 'European Union', 'Japan', 'Australia'];
  const regulatedCategories = ['Food & Beverage', 'Health & Wellness', 'Beauty & Cosmetics'];
  if (strictMarkets.some(m => market.includes(m)) || regulatedCategories.includes(productData.category)) {
    factorReasons.regulatory.push('Compliance requirements require careful attention and investment');
  } else {
    factorReasons.regulatory.push('Regulatory barriers are moderate and manageable');
  }
  if (productData.certifications && productData.certifications.length > 10) {
    factorReasons.regulatory.push('Existing certifications significantly ease market entry');
  } else {
    factorReasons.regulatory.push('Additional certifications may be needed for this market');
  }

  // Logistics reasons
  const nearMarkets = ['Canada', 'Mexico'];
  const distantMarkets = ['Australia', 'Singapore', 'Japan', 'South Korea'];
  const perishableCategories = ['Food & Beverage'];
  if (nearMarkets.includes(market)) {
    factorReasons.logistics.push('Proximity reduces shipping costs and delivery times');
  }
  if (distantMarkets.includes(market)) {
    factorReasons.logistics.push('Distance requires reliable long-haul shipping partnerships');
  }
  if (perishableCategories.includes(productData.category) && productData.shelfLife) {
    factorReasons.logistics.push(`Shelf life of ${productData.shelfLife} supports international shipping`);
  } else if (perishableCategories.includes(productData.category) && !productData.shelfLife) {
    factorReasons.logistics.push('Product perishability poses significant shipping challenges');
  }
  if (productData.productionCapacity.includes('Large') || productData.productionCapacity.includes('Very Large')) {
    factorReasons.logistics.push('Production capacity supports bulk international orders');
  }
  if (factorReasons.logistics.length === 0) {
    factorReasons.logistics.push('Standard shipping arrangements should suffice');
  }

  // Profitability reasons
  if (profitMargin > 50) {
    factorReasons.profitability.push('Excellent margins absorb international costs comfortably');
  } else if (profitMargin > 30) {
    factorReasons.profitability.push('Good margins support expansion with room for investment');
  } else if (profitMargin > 15) {
    factorReasons.profitability.push('Moderate margins require careful cost management');
  } else {
    factorReasons.profitability.push('Tight margins limit flexibility for market entry costs');
  }
  if (productData.sellingPrice > 100) {
    factorReasons.profitability.push('Premium pricing justifies marketing and distribution spend');
  } else {
    factorReasons.profitability.push('Volume sales will be key to profitability');
  }

  // Cultural Fit reasons
  const westernMarkets = ['United States', 'United Kingdom', 'Canada', 'Australia'];
  const asianMarkets = ['Japan', 'South Korea', 'Singapore', 'China'];
  const luxuryCategories = ['Beauty & Cosmetics', 'Fashion & Apparel'];
  if (westernMarkets.includes(market)) {
    factorReasons.culturalFit.push('Western markets align well with most product categories');
  }
  if (asianMarkets.includes(market) && luxuryCategories.includes(productData.category)) {
    factorReasons.culturalFit.push('Premium products resonate strongly in Asian markets');
  }
  if (productData.experience !== 'No prior export experience') {
    factorReasons.culturalFit.push('Experience navigating cultural differences is advantageous');
  } else {
    factorReasons.culturalFit.push('Cultural research and local partnerships recommended');
  }

  // Calculate overall score
  const score = Math.round(
    (factorReasons.marketDemand.length * 0.25) +
    (factorReasons.competition.length * 0.20) +
    (factorReasons.regulatory.length * 0.15) +
    (factorReasons.logistics.length * 0.15) +
    (factorReasons.profitability.length * 0.15) +
    (factorReasons.culturalFit.length * 0.10)
  );

  // Determine recommendation
  let recommendation: 'go' | 'caution' | 'no-go';
  if (score >= 70) recommendation = 'go';
  else if (score >= 50) recommendation = 'caution';
  else recommendation = 'no-go';

  // Generate insights
  const insights: string[] = [];
  const risks: string[] = [];
  const opportunities: string[] = [];

  if (factorReasons.marketDemand.length > 2) {
    insights.push(`Strong market demand for ${productData.category} products in ${market}`);
    opportunities.push('High consumer interest and growing market size');
  }

  if (factorReasons.profitability.length > 2) {
    insights.push(`Healthy profit margin of ${profitMargin.toFixed(1)}% supports market entry costs`);
  } else if (factorReasons.profitability.length < 2) {
    risks.push('Low profit margin may not cover international expansion costs');
  }

  if (factorReasons.competition.length < 2) {
    risks.push('Highly competitive market with established players');
  } else {
    opportunities.push('Moderate competition provides entry opportunities');
  }

  if (factorReasons.regulatory.length < 2) {
    risks.push('Complex regulatory requirements may delay market entry');
    insights.push('Recommend consulting with local compliance experts');
  }

  if (factorReasons.logistics.length < 2) {
    risks.push('Logistics and shipping challenges to this market');
  }

  if (productData.experience === 'No prior export experience') {
    risks.push('Limited export experience may require additional support and resources');
  }

  if (productData.certifications && productData.certifications.length > 0) {
    opportunities.push(`Existing certifications (${productData.certifications}) support market entry`);
  }

  // Cost breakdown
  const manufacturingCost = productData.costPrice;
  const shippingAndDuties = 0.1 * productData.sellingPrice; // 10% of selling price
  const platformFees = 0.05 * productData.sellingPrice; // 5% of selling price
  const marketingCAC = 0.2 * productData.sellingPrice; // 20% of selling price
  const netProfit = productData.sellingPrice - (manufacturingCost + shippingAndDuties + platformFees + marketingCAC);

  // Break-even units
  const breakEvenUnits = (manufacturingCost + shippingAndDuties + platformFees + marketingCAC) / netProfit;

  return {
    market,
    score,
    recommendation,
    factors,
    factorReasons,
    costBreakdown: {
      manufacturingCost,
      shippingAndDuties,
      platformFees,
      marketingCAC,
      netProfit
    },
    breakEvenUnits,
    insights,
    risks,
    opportunities
  };
}

export function Report({ productData, onStartOver }: ReportProps) {
  const analyses = useMemo(() => {
    return productData.targetMarkets.map(market => analyzeMarket(market, productData));
  }, [productData]);

  const overallRecommendation = useMemo(() => {
    const goCount = analyses.filter(a => a.recommendation === 'go').length;
    const totalCount = analyses.length;
    
    if (goCount / totalCount >= 0.6) return 'go';
    if (goCount / totalCount >= 0.3) return 'caution';
    return 'no-go';
  }, [analyses]);

  const averageScore = useMemo(() => {
    return Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length);
  }, [analyses]);

  const getRecommendationIcon = (rec: string) => {
    if (rec === 'go') return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (rec === 'caution') return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === 'go') return 'bg-green-50 border-green-200';
    if (rec === 'caution') return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getRecommendationText = (rec: string) => {
    if (rec === 'go') return 'GO - Recommended';
    if (rec === 'caution') return 'PROCEED WITH CAUTION';
    return 'NO-GO - Not Recommended';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Start New Analysis
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="mb-2 text-gray-900">{productData.productName}</h1>
              <p className="text-gray-600">{productData.category}</p>
            </div>
            <div className={`px-6 py-3 rounded-lg border-2 ${getRecommendationColor(overallRecommendation)}`}>
              <div className="flex items-center gap-3">
                {getRecommendationIcon(overallRecommendation)}
                <div>
                  <div className="text-gray-500">Overall Assessment</div>
                  <div className={getScoreColor(averageScore)}>
                    {getRecommendationText(overallRecommendation)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Average Score</span>
              </div>
              <div className={`${getScoreColor(averageScore)}`}>{averageScore}/100</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">Markets Analyzed</span>
              </div>
              <div className="text-gray-900">{productData.targetMarkets.length}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Profit Margin</span>
              </div>
              <div className="text-gray-900">
                {(((productData.sellingPrice - productData.costPrice) / productData.sellingPrice) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Market-by-Market Analysis */}
        <div className="space-y-6">
          {analyses.map((analysis) => (
            <div key={analysis.market} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="mb-1 text-gray-900">{analysis.market}</h2>
                  <div className="flex items-center gap-2">
                    {getRecommendationIcon(analysis.recommendation)}
                    <span className={getScoreColor(analysis.score)}>
                      {getRecommendationText(analysis.recommendation)} - Score: {analysis.score}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Factor Scores */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Market Demand</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${analysis.factors.marketDemand}%` }}
                      />
                    </div>
                    <span className={getScoreColor(analysis.factors.marketDemand)}>
                      {analysis.factors.marketDemand}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="italic">Why this score:</div>
                    {analysis.factorReasons.marketDemand.slice(0, 2).map((reason, idx) => (
                      <div key={idx}>• {reason}</div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">Competition</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${analysis.factors.competition}%` }}
                      />
                    </div>
                    <span className={getScoreColor(analysis.factors.competition)}>
                      {analysis.factors.competition}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="italic">Why this score:</div>
                    {analysis.factorReasons.competition.slice(0, 2).map((reason, idx) => (
                      <div key={idx}>• {reason}</div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Regulatory</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${analysis.factors.regulatory}%` }}
                      />
                    </div>
                    <span className={getScoreColor(analysis.factors.regulatory)}>
                      {analysis.factors.regulatory}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="italic">Why this score:</div>
                    {analysis.factorReasons.regulatory.slice(0, 2).map((reason, idx) => (
                      <div key={idx}>• {reason}</div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-600">Logistics</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all"
                        style={{ width: `${analysis.factors.logistics}%` }}
                      />
                    </div>
                    <span className={getScoreColor(analysis.factors.logistics)}>
                      {analysis.factors.logistics}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="italic">Why this score:</div>
                    {analysis.factorReasons.logistics.slice(0, 2).map((reason, idx) => (
                      <div key={idx}>• {reason}</div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-600">Profitability</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${analysis.factors.profitability}%` }}
                      />
                    </div>
                    <span className={getScoreColor(analysis.factors.profitability)}>
                      {analysis.factors.profitability}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="italic">Why this score:</div>
                    {analysis.factorReasons.profitability.slice(0, 2).map((reason, idx) => (
                      <div key={idx}>• {reason}</div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-pink-600" />
                    <span className="text-gray-600">Cultural Fit</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-600 h-2 rounded-full transition-all"
                        style={{ width: `${analysis.factors.culturalFit}%` }}
                      />
                    </div>
                    <span className={getScoreColor(analysis.factors.culturalFit)}>
                      {analysis.factors.culturalFit}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="italic">Why this score:</div>
                    {analysis.factorReasons.culturalFit.slice(0, 2).map((reason, idx) => (
                      <div key={idx}>• {reason}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profitability Breakdown & Break-even */}
              <div className="mb-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <h3 className="mb-4 text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  Profitability Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3 text-gray-700">Cost Breakdown (per unit)</div>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span>Manufacturing Cost:</span>
                        <span className="text-gray-900">${analysis.costBreakdown.manufacturingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping & Duties (est.):</span>
                        <span className="text-gray-900">${analysis.costBreakdown.shippingAndDuties.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fees (est.):</span>
                        <span className="text-gray-900">${analysis.costBreakdown.platformFees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Marketing CAC (est.):</span>
                        <span className="text-gray-900">${analysis.costBreakdown.marketingCAC.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-indigo-200 flex justify-between">
                        <span>Net Profit:</span>
                        <span className={`${analysis.costBreakdown.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${analysis.costBreakdown.netProfit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-gray-700">Market Economics</div>
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-lg border border-indigo-200">
                        <div className="text-gray-600 mb-1">Selling Price</div>
                        <div className="text-gray-900">${productData.sellingPrice.toFixed(2)}</div>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-indigo-200">
                        <div className="text-gray-600 mb-1">Break-even Units (approx.)</div>
                        <div className="text-gray-900">
                          {analysis.costBreakdown.netProfit > 0 
                            ? `${Math.ceil(analysis.breakEvenUnits)} units`
                            : 'Not profitable'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {analysis.costBreakdown.netProfit > 0 
                            ? 'Units needed to cover initial market entry costs'
                            : 'Adjust pricing or reduce costs'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights, Risks, Opportunities */}
              <div className="grid md:grid-cols-3 gap-4">
                {analysis.insights.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Key Insights</span>
                    </div>
                    <ul className="space-y-2">
                      {analysis.insights.map((insight, idx) => (
                        <li key={idx} className="text-gray-600 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.risks.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-gray-700">Risks</span>
                    </div>
                    <ul className="space-y-2">
                      {analysis.risks.map((risk, idx) => (
                        <li key={idx} className="text-gray-600 flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.opportunities.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Opportunities</span>
                    </div>
                    <ul className="space-y-2">
                      {analysis.opportunities.map((opp, idx) => (
                        <li key={idx} className="text-gray-600 flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="mb-6 text-gray-900">Summary & Next Steps</h2>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <p className="text-gray-700">
                Based on the analysis of {productData.targetMarkets.length} target market(s), 
                your {productData.productName} has an average market expansion score of {averageScore}/100.
              </p>
            </div>

            {overallRecommendation === 'go' && (
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h3 className="mb-2 text-green-900">Recommended Actions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Develop a detailed market entry strategy for your highest-scoring markets</li>
                  <li>• Engage with local distributors and partners</li>
                  <li>• Ensure all regulatory requirements and certifications are in place</li>
                  <li>• Establish logistics and supply chain partnerships</li>
                  <li>• Consider a phased rollout starting with 1-2 markets</li>
                </ul>
              </div>
            )}

            {overallRecommendation === 'caution' && (
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <h3 className="mb-2 text-yellow-900">Recommended Actions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Focus on markets with "GO" recommendations first</li>
                  <li>• Address key risk factors before market entry</li>
                  <li>• Consider partnerships to mitigate risks and reduce costs</li>
                  <li>• Conduct additional market research for medium-scoring markets</li>
                  <li>• Develop contingency plans for identified challenges</li>
                </ul>
              </div>
            )}

            {overallRecommendation === 'no-go' && (
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <h3 className="mb-2 text-red-900">Recommended Actions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Reconsider market selection and focus on higher-scoring alternatives</li>
                  <li>• Improve product-market fit and competitive positioning</li>
                  <li>• Work on obtaining necessary certifications and compliance</li>
                  <li>• Increase profit margins to support expansion costs</li>
                  <li>• Gain export experience in easier markets first</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
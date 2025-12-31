// frontend/src/app/components/Report.tsx
import { useState, useEffect } from 'react';
import { analyzeProduct } from '../../services/api';
import type { MarketAnalysis } from '../../services/api';
import { ProductData } from '../App';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  ArrowLeft,
  TrendingUp,
  Users,
  Shield,
  DollarSign,
  Globe,
  FileText
} from 'lucide-react';

interface ReportProps {
  productData: ProductData;
  onStartOver: () => void;
}

export function Report({ productData, onStartOver }: ReportProps) {
  const [analyses, setAnalyses] = useState<Record<string, MarketAnalysis>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 调用真实的后端API
  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🚀 Starting product analysis:', productData);
        
        // 调用后端API，由DeepSeek生成分析
        const results = await analyzeProduct(productData);
        
        console.log('✅ Analysis results received:', results);
        setAnalyses(results);
        
      } catch (err) {
        console.error('❌ Analysis failed:', err);
        setError(err instanceof Error ? err.message : 'Analysis failed');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [productData]);

  // 加载状态
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Analyzing Market Data...</h2>
          <p className="text-gray-600">
            AI is analyzing {productData.targetMarkets.length} target market{productData.targetMarkets.length > 1 ? 's' : ''} for "{productData.productName}"
          </p>
          <div className="mt-8 space-y-2">
            {productData.targetMarkets.map((market) => (
              <div key={market} className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-gray-600">Analyzing {market} market...</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-sm text-gray-500">
            This may take 30-60 seconds per market
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-red-900">Analysis Failed</h2>
            </div>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={onStartOver}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 成功状态 - 渲染分析结果
  const analysesArray = Object.values(analyses);
  
  // 计算总体评分
  const averageScore = Math.round(
    analysesArray.reduce((sum, a) => sum + a.overallScore, 0) / analysesArray.length
  );

  const overallRecommendation = averageScore >= 70 ? 'recommended' : 
                                averageScore >= 50 ? 'consider-carefully' : 
                                'not-recommended';

  // 辅助函数
  const getRecommendationIcon = (rec: string) => {
    if (rec === 'strongly-recommended' || rec === 'recommended') 
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (rec === 'consider-carefully') 
      return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  const getRecommendationText = (rec: string) => {
    const map: Record<string, string> = {
      'strongly-recommended': 'Strongly Recommended',
      'recommended': 'Recommended',
      'consider-carefully': 'Consider Carefully',
      'not-recommended': 'Not Recommended'
    };
    return map[rec] || rec;
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === 'strongly-recommended' || rec === 'recommended') 
      return 'bg-green-50 border-green-200';
    if (rec === 'consider-carefully') 
      return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Start New Analysis
        </button>

        {/* 总览卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">{productData.productName}</h1>
              <p className="text-gray-600 text-lg">{productData.category}</p>
            </div>
            <div className={`px-6 py-3 rounded-lg border-2 ${getRecommendationColor(overallRecommendation)}`}>
              <div className="flex items-center gap-3">
                {getRecommendationIcon(overallRecommendation)}
                <div>
                  <div className="text-sm text-gray-600">Overall Assessment</div>
                  <div className={`font-bold ${getScoreColor(averageScore)}`}>
                    {getRecommendationText(overallRecommendation)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Target Markets</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {productData.targetMarkets.length}
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Recommended Markets</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {analysesArray.filter(a => 
                  a.recommendation === 'recommended' || 
                  a.recommendation === 'strongly-recommended'
                ).length}
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">Avg. Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}/100
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Cost Price:</span>
              <span className="ml-2 font-semibold">${productData.costPrice} USD</span>
            </div>
            <div>
              <span className="text-gray-600">Target Selling Price:</span>
              <span className="ml-2 font-semibold">${productData.sellingPrice} USD</span>
            </div>
            <div>
              <span className="text-gray-600">Profit Margin:</span>
              <span className="ml-2 font-semibold">
                {((productData.sellingPrice - productData.costPrice) / productData.sellingPrice * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Current Market:</span>
              <span className="ml-2 font-semibold">{productData.currentMarket}</span>
            </div>
          </div>
        </div>

        {/* 各市场详细分析 */}
        <div className="space-y-6">
          {analysesArray.map((analysis) => (
            <div key={analysis.market} className="bg-white rounded-2xl shadow-xl p-8">
              {/* 市场标题 */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">{analysis.market}</h2>
                  <div className="flex items-center gap-2">
                    {getRecommendationIcon(analysis.recommendation)}
                    <span className={getScoreColor(analysis.overallScore)}>
                      {getRecommendationText(analysis.recommendation)} - Score: {analysis.overallScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* 各维度评分 - 这是 ScoreCard 使用的地方 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <ScoreCard 
                  title="Legal Compliance" 
                  score={analysis.scores.legalCompliance}
                  icon={<Shield className="w-5 h-5 text-blue-600" />}
                  color="blue"
                />
                <ScoreCard 
                  title="Competition" 
                  score={analysis.scores.competitiveAnalysis}
                  icon={<Users className="w-5 h-5 text-purple-600" />}
                  color="purple"
                />
                <ScoreCard 
                  title="Market Demand" 
                  score={analysis.scores.marketDemand}
                  icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                  color="green"
                />
                <ScoreCard 
                  title="Pricing Strategy" 
                  score={analysis.scores.pricingStrategy}
                  icon={<DollarSign className="w-5 h-5 text-orange-600" />}
                  color="orange"
                />
                <ScoreCard 
                  title="Cultural Fit" 
                  score={analysis.scores.culturalAdaptation}
                  icon={<Globe className="w-5 h-5 text-pink-600" />}
                  color="pink"
                />
              </div>

              {/* 详细信息部分 - 这是你问的详细信息在哪里 */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Key Findings */}
                {analysis.keyFindings && analysis.keyFindings.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-900">
                      💡 Key Findings
                    </h3>
                    <ul className="space-y-2">
                      {analysis.keyFindings.map((finding, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk Alerts */}
                {analysis.riskAlerts && analysis.riskAlerts.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-900">
                      ⚠️ Risk Alerts
                    </h3>
                    <ul className="space-y-2">
                      {analysis.riskAlerts.map((risk, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {analysis.actionItems && analysis.actionItems.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-900">
                      ✅ Action Items
                    </h3>
                    <ul className="space-y-2">
                      {analysis.actionItems.map((action, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Opportunities Section */}
              {analysis.opportunities && analysis.opportunities.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-900">
                    🎯 Market Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {analysis.opportunities.map((opp, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-green-600">•</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed Breakdown Sections */}
              <div className="space-y-4">
                {/* Legal Compliance Details */}
                {analysis.legalCompliance && (
                  <details className="group">
                    <summary className="cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Legal & Regulatory Compliance</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            analysis.legalCompliance.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                            analysis.legalCompliance.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {analysis.legalCompliance.riskLevel} Risk
                          </span>
                        </div>
                        <span className={`font-bold ${getScoreColor(analysis.legalCompliance.score)}`}>
                          {analysis.legalCompliance.score}/100
                        </span>
                      </div>
                    </summary>
                    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="space-y-4">
                        {analysis.legalCompliance.regulations && analysis.legalCompliance.regulations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Regulations:</h4>
                            <ul className="space-y-1">
                              {analysis.legalCompliance.regulations.map((reg, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                  <span>•</span>
                                  <span>{reg}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {analysis.legalCompliance.certifications && analysis.legalCompliance.certifications.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Required Certifications:</h4>
                            <ul className="space-y-1">
                              {analysis.legalCompliance.certifications.map((cert, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                  <span>•</span>
                                  <span>{cert}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {analysis.legalCompliance.labelingRequirements && analysis.legalCompliance.labelingRequirements.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Labeling Requirements:</h4>
                            <ul className="space-y-1">
                              {analysis.legalCompliance.labelingRequirements.map((label, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                  <span>•</span>
                                  <span>{label}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                )}

                {/* Competitive Analysis Details */}
                {analysis.competitiveAnalysis && analysis.competitiveAnalysis.competitors && (
                  <details className="group">
                    <summary className="cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold">Competitive Landscape</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            analysis.competitiveAnalysis.competitionIntensity === 'Low' ? 'bg-green-100 text-green-700' :
                            analysis.competitiveAnalysis.competitionIntensity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {analysis.competitiveAnalysis.competitionIntensity} Competition
                          </span>
                        </div>
                        <span className={`font-bold ${getScoreColor(analysis.competitiveAnalysis.score)}`}>
                          {analysis.competitiveAnalysis.score}/100
                        </span>
                      </div>
                    </summary>
                    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-3">Major Competitors:</h4>
                          <div className="space-y-3">
                            {analysis.competitiveAnalysis.competitors.map((comp, idx) => (
                              <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-gray-900">{comp.name}</span>
                                  {comp.marketShare && (
                                    <span className="text-sm text-purple-600 font-medium">{comp.marketShare}</span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Price Range: <span className="font-medium">{comp.priceRange}</span>
                                </div>
                                {comp.strengths && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    Strengths: {comp.strengths}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        {analysis.competitiveAnalysis.marketShareDistribution && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Market Share Distribution:</h4>
                            <p className="text-sm text-gray-600">{analysis.competitiveAnalysis.marketShareDistribution}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                )}

                {/* Market Demand Details */}
                {analysis.marketDemand && (
                  <details className="group">
                    <summary className="cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="font-semibold">Market Demand & Growth</span>
                        </div>
                        <span className={`font-bold ${getScoreColor(analysis.marketDemand.score)}`}>
                          {analysis.marketDemand.score}/100
                        </span>
                      </div>
                    </summary>
                    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Market Size:</h4>
                          <p className="text-sm text-gray-600">{analysis.marketDemand.marketSize}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Growth Trend:</h4>
                          <p className="text-sm text-gray-600">{analysis.marketDemand.growthTrend}</p>
                        </div>
                      </div>
                      {analysis.marketDemand.consumerPreferences && analysis.marketDemand.consumerPreferences.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Consumer Preferences:</h4>
                          <ul className="space-y-1">
                            {analysis.marketDemand.consumerPreferences.map((pref, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                <span>•</span>
                                <span>{pref}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.marketDemand.distributionChannels && analysis.marketDemand.distributionChannels.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Distribution Channels:</h4>
                          <ul className="space-y-1">
                            {analysis.marketDemand.distributionChannels.map((channel, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                <span>•</span>
                                <span>{channel}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Pricing Strategy Details */}
                {analysis.pricingStrategy && (
                  <details className="group">
                    <summary className="cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold">Pricing Strategy</span>
                        </div>
                        <span className={`font-bold ${getScoreColor(analysis.pricingStrategy.score)}`}>
                          {analysis.pricingStrategy.score}/100
                        </span>
                      </div>
                    </summary>
                    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="space-y-4">
                        <div className="p-3 bg-orange-50 rounded border border-orange-200">
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Recommended Price Range:</h4>
                          <div className="text-2xl font-bold text-orange-600">
                            ${analysis.pricingStrategy.recommendedPriceRange.min} - ${analysis.pricingStrategy.recommendedPriceRange.max} {analysis.pricingStrategy.recommendedPriceRange.currency}
                          </div>
                          {analysis.pricingStrategy.recommendedPriceRange.rationale && (
                            <p className="text-sm text-gray-600 mt-2">{analysis.pricingStrategy.recommendedPriceRange.rationale}</p>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Import Duties:</h4>
                            <p className="text-sm text-gray-600">{analysis.pricingStrategy.tariffEstimate}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Logistics Cost:</h4>
                            <p className="text-sm text-gray-600">{analysis.pricingStrategy.logisticsCost}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Expected Margin:</h4>
                            <p className="text-sm text-gray-600">{analysis.pricingStrategy.profitMargin}</p>
                          </div>
                          {analysis.pricingStrategy.breakEvenAnalysis && (
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">Break-Even:</h4>
                              <p className="text-sm text-gray-600">{analysis.pricingStrategy.breakEvenAnalysis}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </details>
                )}

                {/* Cultural Adaptation Details */}
                {analysis.culturalAdaptation && (
                  <details className="group">
                    <summary className="cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-pink-600" />
                          <span className="font-semibold">Cultural Adaptation & Localization</span>
                        </div>
                        <span className={`font-bold ${getScoreColor(analysis.culturalAdaptation.score)}`}>
                          {analysis.culturalAdaptation.score}/100
                        </span>
                      </div>
                    </summary>
                    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="space-y-4">
                        {analysis.culturalAdaptation.localizationRequirements && analysis.culturalAdaptation.localizationRequirements.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Localization Requirements:</h4>
                            <ul className="space-y-1">
                              {analysis.culturalAdaptation.localizationRequirements.map((req, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                  <span>•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {analysis.culturalAdaptation.culturalConsiderations && analysis.culturalAdaptation.culturalConsiderations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Cultural Considerations:</h4>
                            <ul className="space-y-1">
                              {analysis.culturalAdaptation.culturalConsiderations.map((con, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                  <span>•</span>
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {analysis.culturalAdaptation.marketingRecommendations && analysis.culturalAdaptation.marketingRecommendations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Marketing Recommendations:</h4>
                            <ul className="space-y-1">
                              {analysis.culturalAdaptation.marketingRecommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                  <span>•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                )}
              </div>

              {/* 数据来源 */}
              {analysis.sources && analysis.sources.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Data Sources:</p>
                      <p className="text-xs text-gray-500">{analysis.sources.join(' • ')}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Last Updated: {new Date(analysis.lastUpdated).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary & Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Summary & Next Steps</h2>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <p className="text-gray-700">
                Based on the analysis of <strong>{productData.targetMarkets.length}</strong> target market(s), 
                your product "<strong>{productData.productName}</strong>" has an average market expansion score of <strong className={getScoreColor(averageScore)}>{averageScore}/100</strong>.
              </p>
            </div>

            {overallRecommendation === 'recommended' && (
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h3 className="font-bold mb-2 text-green-900">Recommended Actions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Prioritize markets with "Recommended" status for initial expansion</li>
                  <li>• Develop a detailed market entry strategy for your highest-scoring markets</li>
                  <li>• Engage with local distributors and establish partnerships</li>
                  <li>• Ensure all regulatory requirements and certifications are completed</li>
                  <li>• Consider a phased rollout starting with 1-2 markets</li>
                </ul>
              </div>
            )}

            {overallRecommendation === 'consider-carefully' && (
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <h3 className="font-bold mb-2 text-yellow-900">Recommended Actions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Focus on markets with "Recommended" status first</li>
                  <li>• Address key risk factors identified before market entry</li>
                  <li>• Consider partnerships to mitigate risks and reduce costs</li>
                  <li>• Conduct additional market research for medium-scoring markets</li>
                  <li>• Develop contingency plans for identified challenges</li>
                </ul>
              </div>
            )}

            {overallRecommendation === 'not-recommended' && (
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <h3 className="font-bold mb-2 text-red-900">Recommended Actions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Reconsider market selection and focus on higher-scoring alternatives</li>
                  <li>• Improve product-market fit and competitive positioning</li>
                  <li>• Work on obtaining necessary certifications and compliance</li>
                  <li>• Increase profit margins to support expansion costs</li>
                  <li>• Gain export experience in easier markets first</li>
                </ul>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2 text-gray-900">Need Help?</h3>
              <p className="text-gray-700 text-sm">
                Consider consulting with trade specialists, legal advisors, or market entry consultants 
                for detailed guidance on your specific situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ScoreCard 组件 - 这就是你问的 ScoreCard 在哪里
function ScoreCard({ 
  title, 
  score, 
  icon,
  color = 'blue'
}: { 
  title: string; 
  score: number; 
  icon: React.ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-700';
    if (score >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getBarColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const colorMap = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    pink: 'bg-pink-50 border-pink-200'
  };

  return (
    <div className={`p-4 border-2 rounded-lg ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
        </div>
        <span className={`text-xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
      <div className="text-sm font-semibold text-gray-700 mb-2">{title}</div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
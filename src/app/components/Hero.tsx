import { Globe, TrendingUp, BarChart3, Shield } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-8">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600">Global Market Expansion Analysis</span>
        </div>
        
        <h1 className="mb-6 text-blue-900">
          Expand Your Product to Overseas Markets with Confidence
        </h1>
        
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Get a comprehensive go/no-go report analyzing your product's potential in international markets. 
          Our AI-powered analysis evaluates market demand, competition, regulations, and profitability to guide your expansion decisions.
        </p>
        
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl mb-16"
        >
          Start Your Analysis
        </button>

        <div className="grid md:grid-cols-4 gap-8 mt-16">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mb-2">Market Demand</h3>
            <p className="text-gray-600">Analyze market size and consumer demand in target regions</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="mb-2">Competition</h3>
            <p className="text-gray-600">Evaluate competitive landscape and market saturation</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="mb-2">Regulations</h3>
            <p className="text-gray-600">Assess regulatory requirements and compliance complexity</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="mb-2">Logistics</h3>
            <p className="text-gray-600">Review shipping feasibility and distribution challenges</p>
          </div>
        </div>
      </div>
    </div>
  );
}

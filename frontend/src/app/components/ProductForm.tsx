// frontend/src/app/components/ProductForm.tsx
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { ProductData } from '../App';
import { analyzeProduct, checkBackendHealth } from '../../services/api';

interface ProductFormProps {
  onSubmit: (data: ProductData, analysis: any) => void;
  onBack: () => void;
}

const PRODUCT_CATEGORIES = [
  'Electronics',
  'Food & Beverage',
  'Fashion & Apparel',
  'Beauty & Cosmetics',
  'Home & Garden',
  'Sports & Fitness',
  'Toys & Games',
  'Health & Wellness',
  'Automotive',
  'Industrial Equipment',
  'Other'
];

const TARGET_MARKETS = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Australia',
  'Canada',
  'South Korea',
  'Singapore',
  'United Arab Emirates',
  'Brazil',
  'Mexico',
  'India',
  'China'
];

const PRODUCTION_CAPACITY = [
  'Small (< 1,000 units/month)',
  'Medium (1,000 - 10,000 units/month)',
  'Large (10,000 - 100,000 units/month)',
  'Very Large (> 100,000 units/month)'
];

const EXPORT_EXPERIENCE = [
  'No prior export experience',
  'Limited (1-2 markets)',
  'Moderate (3-5 markets)',
  'Extensive (6+ markets)'
];

export function ProductForm({ onSubmit, onBack }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductData>({
    productName: '',
    category: '',
    description: '',
    costPrice: 0,
    sellingPrice: 0,
    targetMarkets: [],
    currentMarket: '',
    productionCapacity: '',
    certifications: '',
    shelfLife: '',
    experience: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check backend health first
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        throw new Error('Backend server is not responding. Please make sure it is running.');
      }

      // Call the analysis API
      const analysis = await analyzeProduct(formData);
      
      // Pass both form data and analysis to parent
      onSubmit(formData, analysis);
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketToggle = (market: string) => {
    setFormData(prev => ({
      ...prev,
      targetMarkets: prev.targetMarkets.includes(market)
        ? prev.targetMarkets.filter(m => m !== market)
        : [...prev.targetMarkets, market]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="mb-2 text-gray-900">Product Information</h2>
          <p className="text-gray-600 mb-8">
            Provide details about your product to receive a comprehensive market analysis
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {error}
              </p>
              <p className="text-red-600 text-xs mt-2">
                Make sure the backend server is running on http://localhost:3000
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label htmlFor="productName" className="block mb-2 text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                required
                disabled={isLoading}
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., Organic Green Tea"
              />
            </div>

            <div>
              <label htmlFor="category" className="block mb-2 text-gray-700">
                Product Category *
              </label>
              <select
                id="category"
                required
                disabled={isLoading}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block mb-2 text-gray-700">
                Product Description *
              </label>
              <textarea
                id="description"
                required
                disabled={isLoading}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Describe your product, its features, and unique selling points..."
              />
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="costPrice" className="block mb-2 text-gray-700">
                  Cost Price (USD) *
                </label>
                <input
                  type="number"
                  id="costPrice"
                  required
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                  value={formData.costPrice || ''}
                  onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="sellingPrice" className="block mb-2 text-gray-700">
                  Target Selling Price (USD) *
                </label>
                <input
                  type="number"
                  id="sellingPrice"
                  required
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                  value={formData.sellingPrice || ''}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Markets */}
            <div>
              <label htmlFor="currentMarket" className="block mb-2 text-gray-700">
                Current/Home Market *
              </label>
              <input
                type="text"
                id="currentMarket"
                required
                disabled={isLoading}
                value={formData.currentMarket}
                onChange={(e) => setFormData({ ...formData, currentMarket: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., United States"
              />
            </div>

            <div>
              <label className="block mb-3 text-gray-700">
                Target Markets (Select all that apply) *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TARGET_MARKETS.map(market => (
                  <label
                    key={market}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                      isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : formData.targetMarkets.includes(market)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isLoading}
                      checked={formData.targetMarkets.includes(market)}
                      onChange={() => handleMarketToggle(market)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{market}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Operations */}
            <div>
              <label htmlFor="productionCapacity" className="block mb-2 text-gray-700">
                Production Capacity *
              </label>
              <select
                id="productionCapacity"
                required
                disabled={isLoading}
                value={formData.productionCapacity}
                onChange={(e) => setFormData({ ...formData, productionCapacity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select capacity</option>
                {PRODUCTION_CAPACITY.map(cap => (
                  <option key={cap} value={cap}>{cap}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="block mb-2 text-gray-700">
                Export Experience *
              </label>
              <select
                id="experience"
                required
                disabled={isLoading}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select experience level</option>
                {EXPORT_EXPERIENCE.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="certifications" className="block mb-2 text-gray-700">
                Certifications & Compliance
              </label>
              <input
                type="text"
                id="certifications"
                disabled={isLoading}
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., ISO 9001, CE, FDA, Organic"
              />
            </div>

            <div>
              <label htmlFor="shelfLife" className="block mb-2 text-gray-700">
                Shelf Life / Durability
              </label>
              <input
                type="text"
                id="shelfLife"
                disabled={isLoading}
                value={formData.shelfLife}
                onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., 24 months, 5 years, N/A"
              />
            </div>

            <button
              type="submit"
              disabled={formData.targetMarkets.length === 0 || isLoading}
              className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Markets...
                </>
              ) : (
                <>
                  Generate Report
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {isLoading && (
              <p className="text-center text-gray-600 text-sm">
                This may take 10-30 seconds depending on the number of markets selected...
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductData } from '../App';

interface ProductFormProps {
  onSubmit: (data: ProductData) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="mb-2 text-gray-900">Product Information</h2>
          <p className="text-gray-600 mb-8">
            Provide details about your product to receive a comprehensive market analysis
          </p>

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
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  min="0"
                  step="0.01"
                  value={formData.costPrice || ''}
                  onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  min="0"
                  step="0.01"
                  value={formData.sellingPrice || ''}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.currentMarket}
                onChange={(e) => setFormData({ ...formData, currentMarket: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      formData.targetMarkets.includes(market)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
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
                value={formData.productionCapacity}
                onChange={(e) => setFormData({ ...formData, productionCapacity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.shelfLife}
                onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 24 months, 5 years, N/A"
              />
            </div>

            <button
              type="submit"
              disabled={formData.targetMarkets.length === 0}
              className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Generate Report
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

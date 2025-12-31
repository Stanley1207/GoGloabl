// frontend/src/app/App.tsx
import { useState } from 'react';
import { Hero } from './components/Hero';
import { ProductForm } from './components/ProductForm';
import { Report } from './components/Report';
import type { MarketAnalysis } from '../services/api';

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

export default function App() {
  const [step, setStep] = useState<'hero' | 'form' | 'report'>('hero');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, MarketAnalysis> | null>(null);

  const handleGetStarted = () => {
    setStep('form');
  };

  const handleFormSubmit = (data: ProductData, analysis: Record<string, MarketAnalysis>) => {
    setProductData(data);
    setAnalysisResults(analysis);
    setStep('report');
  };

  const handleStartOver = () => {
    setProductData(null);
    setAnalysisResults(null);
    setStep('hero');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {step === 'hero' && <Hero onGetStarted={handleGetStarted} />}
      {step === 'form' && (
        <ProductForm 
          onSubmit={handleFormSubmit} 
          onBack={() => setStep('hero')} 
        />
      )}
      {step === 'report' && productData && analysisResults && (
        <Report 
          productData={productData}
          analysisResults={analysisResults}
          onStartOver={handleStartOver} 
        />
      )}
    </div>
  );
}
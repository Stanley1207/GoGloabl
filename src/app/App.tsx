import { useState } from 'react';
import { Hero } from './components/Hero';
import { ProductForm } from './components/ProductForm';
import { Report } from './components/Report';

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

  const handleGetStarted = () => {
    setStep('form');
  };

  const handleFormSubmit = (data: ProductData) => {
    setProductData(data);
    setStep('report');
  };

  const handleStartOver = () => {
    setProductData(null);
    setStep('hero');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {step === 'hero' && <Hero onGetStarted={handleGetStarted} />}
      {step === 'form' && <ProductForm onSubmit={handleFormSubmit} onBack={() => setStep('hero')} />}
      {step === 'report' && productData && (
        <Report productData={productData} onStartOver={handleStartOver} />
      )}
    </div>
  );
}

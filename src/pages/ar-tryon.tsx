import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ARTryOn from '../components/ARTryOn';

const ARTryOnPage: React.FC = () => {
  // Get the latest design from localStorage or state management
  const selectedDesign = localStorage.getItem('selectedDesign') || undefined;
  const tshirtColor = localStorage.getItem('tshirtColor') || '#000000';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Design</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900">AR Try-On</h1>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Try On Your Design</h2>
          <p className="text-gray-600">
            See how your T-shirt design looks on you with our AR technology
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <ARTryOn 
            design={selectedDesign}
            tshirtColor={tshirtColor}
          />
        </div>

        {!selectedDesign && (
          <div className="text-center mt-8">
            <p className="text-gray-500 mb-4">No design selected for AR try-on</p>
            <Link 
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create a Design First
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARTryOnPage;
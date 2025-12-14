
import { Link, Routes, Route } from 'react-router-dom';
import { Sparkles, ShoppingCart } from 'lucide-react';
import { AppProvider, useTshirtState, useDesignState } from './store/AppContext';
import TShirtMockup from './components/TShirtMockup';
import ControlPanel from './components/ControlPanel';
import Collection from './pages/collection';
import Cart from './pages/cart';
import ARTryOnPage from './pages/ar-tryon';

function AppContent() {
  const { tshirtColor, setTshirtColor } = useTshirtState();
  const { currentImage, currentSide, switchSide } = useDesignState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand Name + Logo */}
          <div className="flex items-center space-x-3 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide animate-text-glow flex items-center space-x-2">
              <span>Crishirts</span>
              <img
                src="/assets/logo/Crystal1-transparent.png"
                alt="Crishirts Logo"
                className="w-12 h-12 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-pulse-slow"
              />
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-lg font-semibold">
            <Link
              to="/"
              className="relative text-gray-800 hover:text-purple-600 transition duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-gradient-to-r from-blue-500 to-purple-600 hover:after:w-full after:transition-all after:duration-300"
            >
              Create your Tee
            </Link>

            <Link
              to="/ar-tryon"
              className="relative text-gray-800 hover:text-purple-600 transition duration-300 after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-gradient-to-r from-blue-500 to-purple-600 hover:after:w-full after:transition-all after:duration-300"
            >
              AR Try-On
            </Link>

            <Link
              to="/collection"
              className="relative text-gray-800 hover:text-purple-600 transition duration-300 flex items-center space-x-2 after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-gradient-to-r from-blue-500 to-purple-600 hover:after:w-full after:transition-all after:duration-300"
            >
              <span>Exclusive Collection</span>
              <Sparkles size={20} className="text-yellow-500" />
            </Link>

            <Link
              to="/cart"
              className="relative text-gray-800 hover:text-purple-600 transition duration-300 flex items-center space-x-2 after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-gradient-to-r from-blue-500 to-purple-600 hover:after:w-full after:transition-all after:duration-300"
            >
              <span>Your Cart</span>
              <ShoppingCart size={20} className="text-green-500" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
                {/* Left Side - T-shirt Mockup */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
                    <p className="text-sm text-gray-600">See your design in real-time</p>
                  </div>
                  <div 
                    className="h-full" 
                    style={{
                      background: 'transparent !important',
                      backgroundColor: 'transparent !important'
                    }}
                  >
                    <TShirtMockup
                      color={tshirtColor}
                      design={currentImage}
                      material="cotton"
                      size="M"
                      side={currentSide}
                      onSideSwitch={switchSide}
                    />
                  </div>
                </div>

                {/* Right Side - Controls */}
                <div className="bg-white h-[calc(100vh-200px)]">
                  <div className="px-8 py-6">
                    <h2 className="text-2xl font-extralight text-gray-900 mb-8 tracking-wide">Create Your Tee</h2>
                    <ControlPanel
                      tshirtColor={tshirtColor}
                      onTshirtColorChange={setTshirtColor}
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/ar-tryon" element={<ARTryOnPage />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Crishirts</h3>
              <p className="text-gray-400 text-sm">
                Create unique, personalized t-shirt designs using cutting-edge artificial intelligence technology.
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium mb-3">Features</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Bria-powered design generation</li>
                <li>• AR try-on experience</li>
                <li>• Live mockup preview</li>
                <li>• T-shirt context optimization</li>
                <li>• Design refinement system</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium mb-3">Technology</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Bria API integration</li>
                <li>• WebRTC AR try-on technology</li>
                <li>• React + TypeScript</li>
                <li>• Async generation with status polling</li>
                <li>• Intelligent prompt optimization</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>© 2025 Crishirts. Built with modern web technologies for the future of custom apparel.</p>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInSlow {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(147, 197, 253, 0.8), 0 0 20px rgba(168, 85, 247, 0.6); }
            50% { text-shadow: 0 0 15px rgba(147, 197, 253, 1), 0 0 30px rgba(236, 72, 153, 0.8); }
          }
          @keyframes pulseSlow {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes pingSlow {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.4); opacity: 0; }
          }
          .animate-fade-in { animation: fadeIn 1s ease-in-out; }
          .animate-fade-in-slow { animation: fadeInSlow 1.5s ease-in-out; }
          .animate-text-glow { animation: textGlow 3s infinite ease-in-out; }
          .animate-pulse-slow { animation: pulseSlow 3s infinite; }
          .animate-ping-slow { animation: pingSlow 4s infinite; }

          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

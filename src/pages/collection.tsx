import React from "react";
import { Sparkles } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image?: string;
  available: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Holiday Shirt: Wheels On The Bus",
    category: "Holiday Shirts",
    price: "₹1299",
    image: "/assets/collection/shirt1.png",
    available: true,
  },
  {
    id: 2,
    name: "Hooded Sweater: Nova",
    category: "Oversized Pullovers",
    price: "₹2499",
    image: "/assets/collection/sweater1.png",
    available: true,
  },
  {
    id: 3,
    name: "Hooded Sweater: Breeze",
    category: "Oversized Pullovers",
    price: "₹2499",
    image: "/assets/collection/sweater2.png",
    available: true,
  },
  {
    id: 4,
    name: "Printed T-Shirt: Stayed Home",
    category: "Men Relaxed Fit T-Shirts",
    price: "₹699",
    image: "/assets/collection/tshirt1.png",
    available: true,
  },
  {
    id: 5,
    name: "Crystal Series Limited Drop",
    category: "Premium Wear",
    price: "Coming Soon",
    available: false,
  },
  {
    id: 6,
    name: "Aurora Glow Collection",
    category: "AI-Generated Fits",
    price: "Coming Soon",
    available: false,
  },
];

const Collection: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50/40 to-purple-50 overflow-hidden">
      {/* Animated Crystal Background */}
      <div className="absolute inset-0 -z-10 opacity-60">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-tr from-pink-300 via-purple-300 to-blue-200 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-blue-200 via-indigo-200 to-purple-300 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 flex items-center justify-center space-x-3">
            <span className="animate-text-glow">Exclusive Collection</span>
            <Sparkles className="text-yellow-400" size={32} />
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Explore our limited-edition premium T-shirts and pullovers.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) =>
            item.available ? (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative w-full h-80 bg-gray-50 overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-400">Coming Soon</p>
                  </div>
                  <div className="absolute top-3 left-3 text-xs bg-black/70 text-white px-2 py-1 rounded-md">
                    {item.category.includes("Oversized") ? "OVERSIZED FIT" : "RELAXED FIT"}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-md font-bold text-gray-800 mt-1">{item.price}</p>
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                className="flex flex-col justify-center items-center bg-pink-50 border-2 border-pink-200 rounded-2xl h-80 text-center shadow-inner hover:shadow-pink-200 transition-all duration-500"
              >
                <h3 className="text-2xl font-semibold text-pink-400 animate-pulse font-[cursive] drop-shadow-[0_0_10px_rgba(255,182,193,0.8)]">
                  Coming Soon...
                </h3>
                <p className="text-sm mt-2 text-pink-300">{item.name}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
          .animate-text-glow {
            animation: textGlow 3s infinite ease-in-out;
          }
          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(147,197,253,0.8), 0 0 20px rgba(168,85,247,0.6); }
            50% { text-shadow: 0 0 15px rgba(147,197,253,1), 0 0 30px rgba(236,72,153,0.8); }
          }
          @keyframes pulseSlow {
            0%,100%{opacity:0.9;transform:scale(1);}
            50%{opacity:1;transform:scale(1.05);}
          }
          .animate-pulse-slow{animation:pulseSlow 3s infinite;}
          @keyframes pingSlow {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.4); opacity: 0; }
          }
          .animate-ping-slow{animation:pingSlow 4s infinite;}
        `}
      </style>
    </div>
  );
};

export default Collection;

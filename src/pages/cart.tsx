
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartState } from "../store/AppContext";

export default function Cart() {
  const { cartItems, removeFromCart } = useCartState();

  if (cartItems.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center text-center">
        {/* 🌌 Animated Crystal Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(186,230,253,0.4),_transparent_70%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(240,171,252,0.4),_transparent_70%)] animate-[pulse_6s_infinite_alternate]"></div>
          <div className="absolute inset-0 backdrop-blur-[60px]"></div>
        </div>

        {/* 🧊 Cart Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 bg-white/30 border border-white/40 shadow-xl backdrop-blur-2xl rounded-3xl p-10 max-w-md w-[90%] flex flex-col items-center space-y-6"
        >
          <ShoppingCart className="w-16 h-16 text-indigo-400 drop-shadow-md" />
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 drop-shadow-sm">
            Your cart is as clear as crystal!
          </h1>
          <p className="text-gray-600">
            Looks like you haven't added any magical tees yet.
            <br /> Carts have feelings too 🩵
          </p>

          {/* 💎 Popular Categories */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {[
              "Men's T-Shirts",
              "Women's T-Shirts",
              "Joggers",
              "Shorts",
              "Tank Tops",
              "Full Sleeve T-Shirts",
              "Polos",
            ].map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 text-sm bg-white/40 border border-white/50 rounded-full text-gray-700 hover:bg-white/60 hover:text-indigo-500 transition-all duration-300 cursor-pointer"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* 🔮 Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              to="/"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-400 to-pink-400 text-white font-medium hover:scale-105 transition-all shadow-md"
            >
              Create Your Tee
            </Link>
            <Link
              to="/collection"
              className="px-6 py-2 rounded-xl bg-white/50 border border-indigo-200 text-indigo-600 font-medium hover:bg-white/70 hover:scale-105 transition-all shadow-md"
            >
              Browse Collection
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Cart has items - show them
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-3" />
              Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h1>
          </div>

          {/* Cart Items */}
          <div className="p-6 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* T-shirt Previews - Front & Back */}
                <div className="flex space-x-3 flex-shrink-0">
                  {/* Front Preview */}
                  <div className="relative w-20 h-20">
                    <img
                      src="/mockups/tshirt.png"
                      alt="T-shirt front"
                      className="w-full h-full object-contain"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: item.tshirtColor,
                        mixBlendMode: "multiply",
                        opacity: 0.75,
                        maskImage: "url(/mockups/tshirt.png)",
                        WebkitMaskImage: "url(/mockups/tshirt.png)",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        maskSize: "contain",
                      }}
                    />
                    {(item.frontDesign.imageUrl || item.frontDesign.snapshotUrl) && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ isolation: 'isolate' }}
                      >
                        {item.frontDesign.snapshotUrl ? (
                          // Use canvas-generated snapshot for perfect accuracy
                          <img
                            src={item.frontDesign.snapshotUrl}
                            alt="Front design snapshot"
                            className="absolute inset-0 w-full h-full object-contain"
                            style={{
                              mixBlendMode: "normal",
                              opacity: 1,
                              filter: "none"
                            }}
                          />
                        ) : (
                          // Enhanced fallback with better positioning
                          <img
                            src={item.frontDesign.imageUrl!}
                            alt="Front design"
                            className="absolute object-contain"
                            style={{
                              // Scale alignment to cart preview size (80px container)
                              width: item.frontDesign.alignment 
                                ? `${(item.frontDesign.alignment.width / 560) * 80}px` 
                                : '21px', // (150/560)*80
                              height: item.frontDesign.alignment 
                                ? `${(item.frontDesign.alignment.height / 700) * 80}px` 
                                : '17px', // (150/700)*80
                              top: item.frontDesign.alignment 
                                ? `${(item.frontDesign.alignment.y / 700) * 100}%` 
                                : '40%', // (280/700)*100
                              left: item.frontDesign.alignment 
                                ? `${(item.frontDesign.alignment.x / 560) * 100}%` 
                                : '36.6%', // (205/560)*100
                              transform: item.frontDesign.alignment 
                                ? `translate(-50%, -50%) rotate(${item.frontDesign.alignment.rotation}deg)` 
                                : 'translate(-50%, -50%)',
                              mixBlendMode: "normal",
                              opacity: 0.95,
                              filter: "contrast(1.05) brightness(1.02)"
                            }}
                          />
                        )}
                      </div>
                    )}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-1 rounded">
                      Front
                    </div>
                  </div>

                  {/* Back Preview */}
                  <div className="relative w-20 h-20">
                    <img
                      src="/mockups/tshirtbp.png"
                      alt="T-shirt back"
                      className="w-full h-full object-contain"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: item.tshirtColor,
                        mixBlendMode: "multiply",
                        opacity: 0.75,
                        maskImage: "url(/mockups/tshirtbp.png)",
                        WebkitMaskImage: "url(/mockups/tshirtbp.png)",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        maskSize: "contain",
                      }}
                    />
                    {(item.backDesign.imageUrl || item.backDesign.snapshotUrl) && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ isolation: 'isolate' }}
                      >
                        {item.backDesign.snapshotUrl ? (
                          // Use canvas-generated snapshot for perfect accuracy
                          <img
                            src={item.backDesign.snapshotUrl}
                            alt="Back design snapshot"
                            className="absolute inset-0 w-full h-full object-contain"
                            style={{
                              mixBlendMode: "normal",
                              opacity: 1,
                              filter: "none"
                            }}
                          />
                        ) : (
                          // Enhanced fallback with better positioning
                          <img
                            src={item.backDesign.imageUrl!}
                            alt="Back design"
                            className="absolute object-contain"
                            style={{
                              // Scale alignment to cart preview size (80px container)
                              width: item.backDesign.alignment 
                                ? `${(item.backDesign.alignment.width / 560) * 80}px` 
                                : '21px', // (150/560)*80
                              height: item.backDesign.alignment 
                                ? `${(item.backDesign.alignment.height / 700) * 80}px` 
                                : '17px', // (150/700)*80
                              top: item.backDesign.alignment 
                                ? `${(item.backDesign.alignment.y / 700) * 100}%` 
                                : '40%', // (280/700)*100
                              left: item.backDesign.alignment 
                                ? `${(item.backDesign.alignment.x / 560) * 100}%` 
                                : '36.6%', // (205/560)*100
                              transform: item.backDesign.alignment 
                                ? `translate(-50%, -50%) rotate(${item.backDesign.alignment.rotation}deg)` 
                                : 'translate(-50%, -50%)',
                              mixBlendMode: "normal",
                              opacity: 0.95,
                              filter: "contrast(1.05) brightness(1.02)"
                            }}
                          />
                        )}
                      </div>
                    )}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs px-1 rounded">
                      Back
                    </div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Custom T-shirt</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Front: {item.frontDesign.imageUrl ? item.frontDesign.design : 'No design'}</p>
                    <p>Back: {item.backDesign.imageUrl ? item.backDesign.design : 'No design'}</p>
                    <p>
                      Color: <span className="inline-block w-4 h-4 rounded-full border border-gray-300 ml-1" style={{ backgroundColor: item.tshirtColor }} />
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">Added: {new Date(item.addedAt).toLocaleDateString()}</p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Total: ${totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/"
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
                <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
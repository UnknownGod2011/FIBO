import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Download, ShoppingCart } from 'lucide-react';
import { useCartState } from '../store/AppContext';

const VRTryOn: React.FC = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [designPrompt, setDesignPrompt] = useState<string>('');
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get cart items
  const { cartItems } = useCartState();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserPhoto(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUserPhoto(dataUrl);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (err) {
      setError('Unable to access camera. Please upload a photo instead.');
    }
  };

  const generateVirtualTryOn = async () => {
    if (!userPhoto || !selectedDesign || !designPrompt) {
      setError('Please upload your photo and select a design first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://fibo-t5mv.onrender.com')}/api/virtual-tryon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhoto: userPhoto.split(',')[1], // Remove data:image/jpeg;base64,
          designUrl: selectedDesign,
          designPrompt: designPrompt
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTryOnResult(data.imageUrl);
      } else {
        setError(data.error?.message || 'Virtual try-on failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate virtual try-on');
    } finally {
      setLoading(false);
    }
  };

  // Load latest cart item if available
  React.useEffect(() => {
    if (cartItems.length > 0) {
      const latestItem = cartItems[cartItems.length - 1];
      // Use front design if available, otherwise back design
      const designToUse = latestItem.frontDesign?.imageUrl || latestItem.backDesign?.imageUrl;
      const promptToUse = latestItem.frontDesign?.design || latestItem.backDesign?.design || 'Custom design';
      
      if (designToUse) {
        setSelectedDesign(designToUse);
        setDesignPrompt(promptToUse);
        setSelectedCartItemId(latestItem.id);
      }
    }
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800">VR Try-On Experience</h1>
            <p className="text-sm text-gray-600 mt-1">Upload your photo and see yourself wearing the design</p>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Upload & Controls */}
            <div className="space-y-6">
              {/* Photo Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {userPhoto ? (
                  <div className="space-y-4">
                    <img 
                      src={userPhoto} 
                      alt="Your photo" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto border border-gray-300"
                    />
                    <p className="text-sm text-gray-600">Photo uploaded successfully!</p>
                    <button
                      onClick={() => setUserPhoto(null)}
                      className="text-sm text-red-500 hover:text-red-700 underline"
                    >
                      Remove photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Upload Your Photo</p>
                      <p className="text-sm text-gray-500">Best results with clear torso-up photos</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Choose File
                      </button>
                      <button
                        onClick={handleCameraCapture}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo</span>
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Cart Items Selection */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Select Design from Cart
                </h3>
                {cartItems.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cartItems.map((item) => {
                      const frontDesign = item.frontDesign?.imageUrl;
                      const backDesign = item.backDesign?.imageUrl;
                      const isSelected = selectedCartItemId === item.id;
                      
                      return (
                        <div 
                          key={item.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            const designToUse = frontDesign || backDesign;
                            const promptToUse = item.frontDesign?.design || item.backDesign?.design || 'Custom design';
                            
                            if (designToUse) {
                              setSelectedDesign(designToUse);
                              setDesignPrompt(promptToUse);
                              setSelectedCartItemId(item.id);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {(frontDesign || backDesign) && (
                              <img 
                                src={frontDesign || backDesign || ''} 
                                alt="Cart design" 
                                className="w-12 h-12 object-contain bg-white rounded border"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {item.frontDesign?.design || item.backDesign?.design || 'Custom Design'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {frontDesign && backDesign ? 'Front & Back' : frontDesign ? 'Front Only' : 'Back Only'}
                              </p>
                              <p className="text-xs text-gray-400">
                                Added {new Date(item.addedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No designs in cart</p>
                    <p className="text-xs text-gray-400 mt-1">Create and add designs to cart first</p>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={generateVirtualTryOn}
                disabled={!userPhoto || !selectedDesign || loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating VR Try-On...</span>
                  </>
                ) : (
                  <span>Generate VR Try-On</span>
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Right Side - Result */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50" style={{ aspectRatio: '3/4', minHeight: '400px' }}>
                {tryOnResult ? (
                  <div className="relative h-full">
                    <img 
                      src={tryOnResult} 
                      alt="VR Try-On Result" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = tryOnResult;
                          link.download = `vr-tryon-${Date.now()}.png`;
                          link.click();
                        }}
                        className="p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white transition-colors"
                        title="Download result"
                      >
                        <Download className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Camera className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium">VR Try-On Result</p>
                      <p className="text-sm">Upload your photo and generate to see the result</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for best results:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use a clear photo showing your torso</li>
                  <li>• Good lighting helps with better results</li>
                  <li>• Face the camera directly</li>
                  <li>• Wear a plain shirt for better overlay</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRTryOn;
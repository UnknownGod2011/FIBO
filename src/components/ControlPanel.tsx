import React, { useState, useRef } from 'react';
import { ShoppingCart, Loader2, Plus } from 'lucide-react';
import ColorWheel from './ColorWheel';
import { useDesignState, useCartState, CartItem } from '../store/AppContext';

interface ControlPanelProps {
  tshirtColor: string;
  onTshirtColorChange: (color: string) => void;
}

const API_BASE = `${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://fibo-t5mv.onrender.com')}/api`;

// Debug: Log the API configuration
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  hostname: window.location.hostname,
  finalApiBase: API_BASE
});

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  tshirtColor,
  onTshirtColorChange
}) => {
  // Local state for input fields
  const [prompt, setPrompt] = useState('');
  const [modifyPrompt, setModifyPrompt] = useState('');
  const [vectorMode] = useState(false);
  
  // Upload state
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Global state from context
  const {
    currentImage,
    isGenerating,
    isRefining,
    canRefine,
    error,
    success,
    generationProgress,
    frontDesign,
    backDesign,
    frontAlignment,
    backAlignment,
    setGenerating,
    setRefining,
    setGeneratedImage,
    setRefinedImage,
    setLastPrompt,
    setLastRefinementPrompt,
    setError,
    setSuccess,
    setGenerationProgress,
  } = useDesignState();
  
  const { addToCart } = useCartState();

  // Handle sketch upload for ControlNet Canny processing
  const handleSketchUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a design description first, then upload your sketch');
      return;
    }

    setIsProcessingUpload(true);
    setError(null);
    setGenerationProgress('Converting sketch to professional design...');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        const base64Data = imageDataUrl.split(',')[1]; // Remove data:image/jpeg;base64,
        
        try {
          // Call sketch-to-design API
          const response = await fetch(`${API_BASE}/generate-from-sketch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              prompt: prompt,
              sketchImageData: base64Data
            }),
          });
          
          const data = await handleApiResponse(response);
          
          setGenerationProgress('');
          setSuccess('✅ Enhanced professional design created!');
          setTimeout(() => setSuccess(null), 3000);
          
          // Update global state with generated design
          setGeneratedImage(data.imageUrl);
          setLastPrompt(`Enhanced professional design: ${prompt}`);
          
          // Clear the prompt since it was used
          setPrompt('');
          
        } catch (err: any) {
          console.error('Sketch processing error:', err);
          setGenerationProgress('');
          setError(err.message || 'Failed to process sketch');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Sketch upload error:', err);
      setGenerationProgress('');
      setError(err.message || 'Failed to upload sketch');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Handle file upload with FIBO processing and background removal
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setIsProcessingUpload(true);
    setError(null);
    setGenerationProgress('Processing uploaded image...');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        
        // Set preview immediately
        setUploadedDesign(imageDataUrl);
        
        setGenerationProgress('Processing design...');
        
        try {
          // Call backend to enhance and remove background
          const response = await fetch(`${API_BASE}/process-upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              imageData: imageDataUrl
            }),
          });
          
          const data = await handleApiResponse(response);
          
          setGenerationProgress('');
          const steps = data.processingSteps ? data.processingSteps.length : 0;
          const quality = data.maxResolution ? 'maximum resolution' : data.enhanced ? 'enhanced quality' : 'processed';
          setSuccess(`✅ Advanced processing complete: ${steps} steps, ${quality}!`);
          setTimeout(() => setSuccess(null), 3000);
          
          // Update global state with processed image
          setGeneratedImage(data.imageUrl);
          setLastPrompt('Uploaded and processed design');
          
        } catch (err: any) {
          console.error('Processing error:', err);
          setGenerationProgress('');
          setError(err.message || 'Failed to process uploaded design');
          
          // Fallback: use original uploaded image
          setGeneratedImage(imageDataUrl);
          setLastPrompt('Uploaded design (original)');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Upload error:', err);
      setGenerationProgress('');
      setError(err.message || 'Failed to upload design');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Handle clipboard paste with FIBO processing
  const handleClipboardPaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], 'pasted-image.png', { type });
            await handleFileUpload(file);
            return;
          }
        }
      }
      
      setError('No image found in clipboard');
    } catch (err: any) {
      console.error('Clipboard error:', err);
      setError('Failed to paste from clipboard');
    }
  };

  // Handle file input change - detect if it's for sketch or regular upload
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if this was triggered by sketch button (has prompt) or regular upload
      if (prompt.trim()) {
        handleSketchUpload(file);
      } else {
        handleFileUpload(file);
      }
    }
  };

  // Handle API responses with proper error handling
  const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error?.message || "API request failed");
    }
    
    return data;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a design description");
      return;
    }
    
    // Lock the button immediately
    setGenerating(true);
    setError(null);
    setSuccess(null);
    setGenerationProgress('Starting generation...');
    
    try {
      // Call appropriate API based on vector mode
      const endpoint = vectorMode ? '/generate-vector' : '/generate';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await handleApiResponse(response);
      
      setGenerationProgress('');
      setSuccess('✅ Design generated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Update global state with generated image
      setGeneratedImage(data.imageUrl);
      setLastPrompt(prompt);
      
      // Clear the input field
      setPrompt('');
      
    } catch (err: any) {
      console.error('Generation error:', err);
      setGenerationProgress('');
      setError(err.message || "Failed to generate design - please try again");
    } finally {
      setGenerating(false);
    }
  };

  const handleModify = async () => {
    if (!modifyPrompt.trim()) {
      setError("Please enter modification instructions");
      return;
    }
    
    if (!currentImage) {
      setError("Please generate a design first before refining");
      return;
    }
    
    // Lock refinement button
    setRefining(true);
    setError(null);
    setSuccess(null);
    setGenerationProgress('Starting refinement...');
    
    try {
      // Call new Bria refinement API
      const response = await fetch(`${API_BASE}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          instruction: modifyPrompt,
          imageUrl: currentImage
        }),
      });
      
      const data = await handleApiResponse(response);
      
      setGenerationProgress('');
      setSuccess('✅ Design refined successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Update global state with refined image
      setRefinedImage(data.refinedImageUrl);
      setLastRefinementPrompt(modifyPrompt);
      
      // Clear the input field
      setModifyPrompt('');
      
      // Update localStorage for AR try-on page
      localStorage.setItem('selectedDesign', data.refinedImageUrl);
      localStorage.setItem('tshirtColor', tshirtColor);
      
    } catch (err: any) {
      console.error('Refinement error:', err);
      setGenerationProgress('');
      setError(err.message || "Failed to refine design - please try again");
    } finally {
      setRefining(false);
    }
  };



  // Canvas-based snapshot generation for accurate cart previews
  const generateCanvasSnapshot = async (side: 'front' | 'back'): Promise<string | null> => {
    const design = side === 'front' ? frontDesign : backDesign;
    const alignment = side === 'front' ? frontAlignment : backAlignment;
    
    if (!design.currentImage) return null;

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      // Set canvas size to match T-shirt mockup dimensions
      canvas.width = 560;
      canvas.height = 700;

      const tshirtImg = new Image();
      const designImg = new Image();
      
      let imagesLoaded = 0;
      const checkComplete = () => {
        imagesLoaded++;
        if (imagesLoaded === 2) {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw T-shirt base
          ctx.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);
          
          // Apply T-shirt color using composite operations
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = tshirtColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Reset composite mode for design
          ctx.globalCompositeOperation = 'source-over';
          
          // Draw design with exact alignment
          ctx.save();
          ctx.translate(
            alignment.x + alignment.width / 2,
            alignment.y + alignment.height / 2
          );
          ctx.rotate((alignment.rotation * Math.PI) / 180);
          ctx.drawImage(
            designImg,
            -alignment.width / 2,
            -alignment.height / 2,
            alignment.width,
            alignment.height
          );
          ctx.restore();
          
          // Convert to data URL
          resolve(canvas.toDataURL('image/png', 0.9));
        }
      };

      tshirtImg.crossOrigin = 'anonymous';
      designImg.crossOrigin = 'anonymous';
      
      tshirtImg.onload = checkComplete;
      designImg.onload = checkComplete;
      
      tshirtImg.onerror = () => resolve(null);
      designImg.onerror = () => resolve(null);
      
      tshirtImg.src = side === 'front' ? '/mockups/tshirt.png' : '/mockups/tshirtbp.png';
      designImg.src = design.currentImage!;
    });
  };

  const handleAddToCart = async () => {
    if (!frontDesign.currentImage && !backDesign.currentImage) {
      setError("Please generate at least one design (front or back)");
      return;
    }

    try {
      setGenerationProgress('Creating accurate cart preview...');
      
      // Generate canvas-based snapshots for perfect alignment
      const frontSnapshot = frontDesign.currentImage ? await generateCanvasSnapshot('front') : null;
      const backSnapshot = backDesign.currentImage ? await generateCanvasSnapshot('back') : null;
      
      // Create enhanced cart item with canvas snapshots and alignment data
      const cartItem: CartItem = {
        id: Date.now().toString(),
        frontDesign: {
          imageUrl: frontDesign.currentImage,
          design: frontDesign.lastPrompt || 'No front design',
          alignment: frontAlignment,
          snapshotUrl: frontSnapshot || undefined // Canvas-generated accurate preview
        },
        backDesign: {
          imageUrl: backDesign.currentImage,
          design: backDesign.lastPrompt || 'No back design',
          alignment: backAlignment,
          snapshotUrl: backSnapshot || undefined // Canvas-generated accurate preview
        },
        tshirtColor,
        material: 'Cotton', // Default material
        size: 'M', // Default size
        addedAt: new Date().toISOString(),
        price: 29.99,
        arData: {
          frontMockupUrl: frontDesign.currentImage || undefined,
          backMockupUrl: backDesign.currentImage || undefined,
          frontSnapshotUrl: frontSnapshot || undefined,
          backSnapshotUrl: backSnapshot || undefined,
          lastUsedForAR: new Date().toISOString()
        }
      };

      // Add to global cart state (this will also persist to localStorage)
      addToCart(cartItem);
      
      // Also call backend for any additional processing
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontDesign: {
            imageUrl: frontDesign.currentImage,
            design: frontDesign.lastPrompt || 'No front design'
          },
          backDesign: {
            imageUrl: backDesign.currentImage,
            design: backDesign.lastPrompt || 'No back design'
          },
          tshirtColor
        }),
      });

      await handleApiResponse(response);
      setSuccess('✅ T-shirt added to cart with both sides!');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err: any) {
      console.error('Add to cart error:', err);
      setError(err.message || "Failed to add to cart");
    }
  };

  return (
    <div className="space-y-8">
      {/* Design Upload Section - One Horizontal Line */}
      <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Add your design</span>
        
        {/* From File Option */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">From file</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingUpload || isGenerating || isRefining}
            className="flex items-center justify-center w-6 h-6 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Upload from file"
          >
            <Plus className="w-3 h-3 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>
        
        {/* From Clipboard Option */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">From clipboard</span>
          <button
            onClick={handleClipboardPaste}
            disabled={isProcessingUpload || isGenerating || isRefining}
            className="flex items-center justify-center w-6 h-6 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Paste from clipboard"
          >
            <Plus className="w-3 h-3 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>
        
        {/* Your Sketch Option */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Your sketch</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingUpload || isGenerating || isRefining}
            className="flex items-center justify-center w-6 h-6 bg-purple-100 border border-purple-300 rounded-full hover:bg-purple-200 hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Upload a sketch for enhanced professional design generation (requires prompt first)"
          >
            <Plus className="w-3 h-3 text-purple-600 group-hover:text-purple-800" />
          </button>
        </div>
        
        {/* Inline Processing Status */}
        {isProcessingUpload && (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-xs text-blue-600">Processing...</span>
          </div>
        )}
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Uploaded Design Preview */}
      {uploadedDesign && (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src={uploadedDesign} 
              alt="Uploaded design" 
              className="w-12 h-12 object-cover rounded border border-gray-300"
            />
            <span className="text-sm text-gray-600">Design ready for use</span>
            <button
              onClick={() => {
                setUploadedDesign(null);
                setGeneratedImage('');
              }}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Primary Prompt with inline button */}
      <div className="flex space-x-3">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Describe your design..."
          className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
          disabled={isGenerating || isRefining}
        />
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || isRefining || !prompt.trim()}
          className={`px-6 py-2.5 text-sm font-medium text-white border rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors ${vectorMode ? 'bg-purple-600 border-purple-600' : 'bg-blue-600 border-blue-600'}`}
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </div>
          ) : `Generate ${vectorMode ? 'Minimalist' : 'Design'}`}
        </button>
      </div>

      {/* Progress and Status Messages */}
      {(isGenerating || isRefining) && generationProgress && (
        <div className="text-xs text-blue-600 text-center bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{generationProgress}</span>
          </div>
          <div className="mt-1 text-gray-500">
            🎨 This may take 30-60 seconds
          </div>
        </div>
      )}

      {success && (
        <div className="text-xs text-green-600 text-center bg-green-50 p-3 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      {/* Modification Prompt with inline button */}
      <div className="flex space-x-3">
        <input
          value={modifyPrompt}
          onChange={(e) => setModifyPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleModify()}
          placeholder="Modify design..."
          className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 transition-colors"
          disabled={isGenerating || isRefining || !currentImage || !canRefine}
        />
        <button 
          onClick={handleModify}
          disabled={isGenerating || isRefining || !modifyPrompt.trim() || !currentImage || !canRefine}
          className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isRefining ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Refining...</span>
            </div>
          ) : 'Refine'}
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="font-medium">❌ Error</div>
          <div className="mt-1">{error}</div>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Color Selection */}
      <div className="flex items-center justify-center space-x-8">
        <ColorWheel 
          selectedColor={tshirtColor}
          onColorChange={onTshirtColorChange}
        />
        <div className="grid grid-cols-2 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onTshirtColorChange(color)}
              className="w-7 h-7 rounded border border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart */}
        <button 
          onClick={handleAddToCart}
          disabled={!currentImage}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
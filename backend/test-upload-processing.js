/**
 * Test script for the new upload processing endpoint
 */

import axios from 'axios';

const API_BASE = "http://localhost:5001/api";

async function testUploadProcessing() {
  console.log('🧪 Testing upload processing endpoint...');
  
  try {
    // Create a simple base64 test image (1x1 pixel PNG)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const response = await axios.post(`${API_BASE}/process-upload`, {
      imageData: testImageData
    });
    
    console.log('✅ Upload processing test successful!');
    console.log('Response:', {
      success: response.data.success,
      message: response.data.message,
      hasImageUrl: !!response.data.imageUrl,
      hasTransparentBg: response.data.hasTransparentBg,
      isProcessedUpload: response.data.isProcessedUpload,
      processingMethod: response.data.processingMethod,
      upscaled: response.data.upscaled,
      enhanced: response.data.enhanced,
      preservesOriginalDesign: response.data.preservesOriginalDesign
    });
    
  } catch (error) {
    console.error('❌ Upload processing test failed:', error.response?.data || error.message);
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testUploadProcessing();
}

export { testUploadProcessing };
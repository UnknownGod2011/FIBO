import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

async function testSingleCase() {
  console.log('🧪 Testing single case: "turn blue"');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/test/multi-edit`, {
      instruction: "turn blue"
    });
    
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSingleCase();
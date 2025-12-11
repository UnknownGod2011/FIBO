/**
 * Test edge cases and unusual phrasings to identify issues
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

async function testEdgeCases() {
  console.log('🧪 Testing Edge Cases and Unusual Phrasings...\n');
  
  const edgeCases = [
    // Issue 1: Unusual color change phrasings
    "change the color to blue",
    "make it blue", 
    "turn blue",
    "blue color",
    "color blue",
    "make everything blue",
    
    // Issue 2: Vague background requests
    "add forest background",
    "forest behind",
    "put in forest",
    "forest scene",
    "make background forest",
    
    // Issue 3: Mixed operations
    "add a hat and change the background to a forest",
    "put sunglasses and forest background",
    "hat and forest",
    "add hat, forest background",
    
    // Issue 4: Very vague instructions
    "make it better",
    "add something cool",
    "change it",
    "different background",
    "more colorful"
  ];
  
  for (const testCase of edgeCases) {
    console.log(`\n📝 Testing: "${testCase}"`);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/test/multi-edit`, {
        instruction: testCase
      });
      
      console.log(`   - Strategy: ${response.data.analysis.strategy}`);
      console.log(`   - Operations: ${response.data.analysis.operations.length}`);
      
      if (response.data.analysis.operations.length > 0) {
        response.data.analysis.operations.forEach((op, i) => {
          console.log(`     ${i + 1}. ${op.type}: "${op.instruction}"`);
          console.log(`        Target: "${op.target || 'none'}", Value: "${op.value || 'none'}"`);
        });
        
        // Check if it's properly categorized
        const hasObjectEdit = response.data.analysis.operations.some(op => 
          op.type === 'object_addition' || op.type === 'object_modification'
        );
        const hasBackgroundEdit = response.data.analysis.operations.some(op => 
          op.type === 'background_edit'
        );
        
        if (testCase.includes('hat') && testCase.includes('forest')) {
          if (hasObjectEdit && hasBackgroundEdit) {
            console.log(`   ✅ GOOD: Mixed operation detected correctly`);
          } else {
            console.log(`   ❌ ISSUE: Mixed operation not detected properly`);
          }
        }
      } else {
        console.log(`   ❌ ISSUE: No operations detected`);
      }
      
    } catch (error) {
      console.error(`   ❌ ERROR: ${error.message}`);
    }
  }
}

// Run the test
testEdgeCases()
  .then(() => {
    console.log('\n✅ Edge cases test completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
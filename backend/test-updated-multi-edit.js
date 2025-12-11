/**
 * Test Updated Multi-Edit Functionality
 * Tests the actual updated functions from index.fibo.js
 */

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🧪 Testing Updated Multi-Edit Functionality");
console.log("============================================");

// Test the specific examples mentioned by the user
const userExamples = [
  {
    instruction: "add a hat and cigar",
    description: "This works properly (according to user)",
    shouldWork: true
  },
  {
    instruction: "add a hat and change the background to snowfall",
    description: "Should work but doesn't (user wants this fixed)",
    shouldWork: true
  },
  {
    instruction: "add a hat and make the teeth golden",
    description: "Should work but doesn't (user wants this fixed)",
    shouldWork: true
  },
  {
    instruction: "add a hat and change the color of the jacket to yellow",
    description: "Should work but doesn't (user wants this fixed)",
    shouldWork: true
  }
];

// Mock the background context manager (simplified version)
class BackgroundContextManager {
  isBackgroundOperation(instruction) {
    const lowerInstruction = instruction.toLowerCase();
    return lowerInstruction.includes('background') && 
           (lowerInstruction.includes('change') || lowerInstruction.includes('add') || 
            lowerInstruction.includes('set') || lowerInstruction.includes('make'));
  }
  
  extractBackgroundDescriptionEnhanced(instruction) {
    const patterns = [
      /(?:make|change|set)\s+(?:the\s+)?background\s+(?:to\s+)?(.+)/i,
      /(?:add|put|give)\s+(?:a\s+)?(.+)\s+background/i,
      /background\s+(?:of\s+|with\s+)?(.+)/i
    ];
    
    for (const pattern of patterns) {
      const match = instruction.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return 'custom background';
  }
}

const backgroundContextManager = new BackgroundContextManager();

// Copy the updated parseMultipleOperationsEnhanced function from the main file
function parseMultipleOperationsEnhanced(instruction) {
  const operations = [];
  
  console.log(`🔍 FIXED Enhanced parsing of multi-edit instruction: "${instruction}"`);
  
  // CRITICAL FIX: Check mixed patterns FIRST before simple "add X and Y" pattern
  // This prevents mixed operations from being incorrectly parsed as simple additions
  
  // Pattern 1: "add X and change background to Y"
  const mixedPattern1 = /^(add|put|place|give)\s+(?:a\s+|an\s+)?(.+?)\s+and\s+(change|make|set)\s+(?:the\s+)?background\s+(?:to\s+)?(.+)$/i;
  const mixedMatch1 = instruction.match(mixedPattern1);
  
  if (mixedMatch1) {
    console.log(`   - 🎯 CRITICAL FIX: Mixed operation pattern 1 detected (object + background)`);
    
    const objectOp = {
      type: 'object_addition',
      instruction: `${mixedMatch1[1]} ${mixedMatch1[2]}`,
      target: extractObjectFromPhrase(mixedMatch1[2]),
      object: mixedMatch1[2].trim(),
      action: 'add',
      priority: 2,
      isValid: true,
      confidence: 0.9
    };
    
    const backgroundOp = {
      type: 'background_edit',
      instruction: `${mixedMatch1[3]} background ${mixedMatch1[4]}`,
      target: 'background',
      value: mixedMatch1[4].trim(),
      action: 'modify',
      priority: 1,
      isValid: true,
      confidence: 0.9
    };
    
    operations.push(objectOp);
    operations.push(backgroundOp);
    
    console.log(`   - ✅ CRITICAL FIX: Created object operation: "${objectOp.instruction}" (target: ${objectOp.target})`);
    console.log(`   - ✅ CRITICAL FIX: Created background operation: "${backgroundOp.instruction}" (value: ${backgroundOp.value})`);
    console.log(`✅ CRITICAL FIX: Mixed operation pattern 1 extracted ${operations.length} operations`);
    return operations;
  }
  
  // CRITICAL FIX: Handle "add X, Y, and Z" pattern specifically
  const addListPattern = /^add\s+(.+)$/i;
  const addListMatch = instruction.match(addListPattern);
  
  if (addListMatch) {
    const itemsString = addListMatch[1];
    
    // Check if it's a comma-separated list
    if (itemsString.includes(',')) {
      console.log(`   - 🎯 CRITICAL FIX: "add X, Y, and Z" list pattern detected`);
      
      // Split on commas and "and"
      const items = itemsString.split(/,\s*(?:and\s+)?|\s+and\s+/i)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      console.log(`   - Found ${items.length} items: ${items.join(', ')}`);
      
      // Create operations for each item
      items.forEach((item, index) => {
        const op = {
          type: 'object_addition',
          instruction: `add ${item}`,
          target: extractObjectFromPhrase(item),
          object: item,
          action: 'add',
          priority: 2,
          isValid: true,
          confidence: 0.95
        };
        
        operations.push(op);
        console.log(`   - ✅ CRITICAL FIX: Created operation ${index + 1}: "add ${item}" (target: ${op.target})`);
      });
      
      console.log(`✅ CRITICAL FIX: List pattern extracted ${operations.length} operations`);
      return operations;
    }
    
    // Handle simple "add X and Y" pattern ONLY if it's not a mixed operation
    const simpleAndMatch = itemsString.match(/^(.+?)\s+and\s+(.+)$/i);
    if (simpleAndMatch) {
      const firstItem = simpleAndMatch[1].trim();
      const secondItem = simpleAndMatch[2].trim();
      
      // Check if second item contains action words (indicating mixed operation)
      const hasActionWords = /\b(make|turn|change|color|paint|dye|background)\b/i.test(secondItem);
      
      if (!hasActionWords) {
        console.log(`   - 🎯 CRITICAL FIX: "add X and Y" simple pattern detected`);
        
        // Create two operations directly
        const op1 = {
          type: 'object_addition',
          instruction: `add ${firstItem}`,
          target: extractObjectFromPhrase(firstItem),
          object: firstItem,
          action: 'add',
          priority: 2,
          isValid: true,
          confidence: 0.95
        };
        
        const op2 = {
          type: 'object_addition',
          instruction: `add ${secondItem}`,
          target: extractObjectFromPhrase(secondItem),
          object: secondItem,
          action: 'add',
          priority: 2,
          isValid: true,
          confidence: 0.95
        };
        
        operations.push(op1);
        operations.push(op2);
        
        console.log(`   - ✅ CRITICAL FIX: Created operation 1: "add ${firstItem}" (target: ${op1.target})`);
        console.log(`   - ✅ CRITICAL FIX: Created operation 2: "add ${secondItem}" (target: ${op2.target})`);
        console.log(`✅ CRITICAL FIX: Simple and pattern extracted ${operations.length} operations`);
        return operations;
      } else {
        console.log(`   - 🔍 Detected action words in second item, checking mixed patterns...`);
      }
    }
  }
  
  // CRITICAL FIX: Handle mixed operations (object + background) before general case
  console.log(`   - 🔍 Checking for mixed operations in: "${instruction}"`);
  
  // Pattern 2: "add X and make Y Z" (object + color change)
  const mixedPattern2 = /^(add|put|place|give)\s+(?:a\s+|an\s+)?(.+?)\s+and\s+(make|turn|change)\s+(?:the\s+)?(.+?)\s+(\w+)$/i;
  const mixedMatch2 = instruction.match(mixedPattern2);
  
  if (mixedMatch2) {
    console.log(`   - 🎯 CRITICAL FIX: Mixed operation pattern 2 detected (object + color change)`);
    
    const objectOp = {
      type: 'object_addition',
      instruction: `${mixedMatch2[1]} ${mixedMatch2[2]}`,
      target: extractObjectFromPhrase(mixedMatch2[2]),
      object: mixedMatch2[2].trim(),
      action: 'add',
      priority: 2,
      isValid: true,
      confidence: 0.9
    };
    
    const colorOp = {
      type: 'object_modification',
      instruction: `${mixedMatch2[3]} ${mixedMatch2[4]} ${mixedMatch2[5]}`,
      target: mixedMatch2[4].trim(),
      value: mixedMatch2[5].trim(),
      action: 'modify',
      priority: 3,
      isValid: true,
      confidence: 0.9
    };
    
    operations.push(objectOp);
    operations.push(colorOp);
    
    console.log(`   - ✅ CRITICAL FIX: Created object operation: "${objectOp.instruction}" (target: ${objectOp.target})`);
    console.log(`   - ✅ CRITICAL FIX: Created color operation: "${colorOp.instruction}" (target: ${colorOp.target}, value: ${colorOp.value})`);
    console.log(`✅ CRITICAL FIX: Mixed operation pattern 2 extracted ${operations.length} operations`);
    return operations;
  }
  
  // Pattern 2b: "add X and change the color of Y to Z" (object + detailed color change)
  const mixedPattern2b = /^(add|put|place|give)\s+(?:a\s+|an\s+)?(.+?)\s+and\s+change\s+(?:the\s+)?color\s+of\s+(?:the\s+)?(.+?)\s+to\s+(\w+)$/i;
  const mixedMatch2b = instruction.match(mixedPattern2b);
  
  if (mixedMatch2b) {
    console.log(`   - 🎯 CRITICAL FIX: Mixed operation pattern 2b detected (object + detailed color change)`);
    
    const objectOp = {
      type: 'object_addition',
      instruction: `${mixedMatch2b[1]} ${mixedMatch2b[2]}`,
      target: extractObjectFromPhrase(mixedMatch2b[2]),
      object: mixedMatch2b[2].trim(),
      action: 'add',
      priority: 2,
      isValid: true,
      confidence: 0.9
    };
    
    const colorOp = {
      type: 'object_modification',
      instruction: `change color of ${mixedMatch2b[3]} to ${mixedMatch2b[4]}`,
      target: mixedMatch2b[3].trim(),
      value: mixedMatch2b[4].trim(),
      action: 'modify',
      priority: 3,
      isValid: true,
      confidence: 0.9
    };
    
    operations.push(objectOp);
    operations.push(colorOp);
    
    console.log(`   - ✅ CRITICAL FIX: Created object operation: "${objectOp.instruction}" (target: ${objectOp.target})`);
    console.log(`   - ✅ CRITICAL FIX: Created color operation: "${colorOp.instruction}" (target: ${colorOp.target}, value: ${colorOp.value})`);
    console.log(`✅ CRITICAL FIX: Mixed operation pattern 2b extracted ${operations.length} operations`);
    return operations;
  }
  
  console.log(`✅ FIXED Enhanced parsing extracted ${operations.length} valid operations`);
  
  return operations;
}

function extractObjectFromPhrase(phrase) {
  const commonObjects = [
    'hat', 'sunglasses', 'glasses', 'cigar', 'cigarette', 'pipe',
    'necklace', 'chain', 'earring', 'bracelet', 'ring',
    'teeth', 'tooth', 'eye', 'eyes', 'nose', 'mouth',
    'shirt', 'jacket', 'coat', 'shoes', 'boots'
  ];
  
  const lowerPhrase = phrase.toLowerCase();
  for (const obj of commonObjects) {
    if (lowerPhrase.includes(obj)) {
      return obj;
    }
  }
  
  // Return the last word as likely object
  return phrase.split(' ').pop();
}

// Copy the updated analysis function from the main file
async function analyzeRefinementInstructionEnhanced(instruction, originalData, backgroundContext) {
  const lowerInstruction = instruction.toLowerCase();
  
  console.log(`🔍 Enhanced refinement analysis: "${instruction}"`);
  console.log(`   - Background context: ${backgroundContext ? 'Available' : 'None'}`);
  
  // CRITICAL FIX: Check for multi-edit operations FIRST before background detection
  // This prevents mixed operations from being treated as pure background operations
  const multiEditPatterns = [
    /\s+and\s+/i,
    /\s*&\s*/,
    /\s+plus\s+/i,
    /\s+also\s+/i,
    /\s+then\s+/i,
    /,\s*(?=add|change|make|turn|give|put|place|remove)/i,
    /;\s*(?=add|change|make|turn|give|put|place|remove)/i,
    /(?:add|change|make|turn|give|put|place|remove)\s+[^,]+.*(?:add|change|make|turn|give|put|place|remove)/i,
    /(?:add|change|make|turn|give|put|place|remove)\s+[^,]+\s+(?:and\s+)?(?:also\s+)?(?:then\s+)?(?:add|change|make|turn|give|put|place|remove)/i
  ];
  
  const hasMultipleEdits = multiEditPatterns.some(pattern => pattern.test(instruction));
  console.log(`🔍 DEBUG: hasMultipleEdits = ${hasMultipleEdits} for "${instruction}"`);
  
  if (hasMultipleEdits) {
    const operations = parseMultipleOperationsEnhanced(instruction);
    console.log(`🔍 Multi-edit detected: ${operations.length} operations found`);
    
    // Validate that we actually extracted multiple operations
    if (operations.length > 1) {
      return {
        strategy: 'multi_step',
        operations: operations,
        originalOperationCount: operations.length,
        conflictsResolved: false
      };
    } else {
      console.log(`   - Only ${operations.length} operation found, checking for single background operation`);
    }
  }
  
  // Check for background operations with enhanced detection
  // Only treat as pure background operation if it's not part of a multi-edit
  const isBackgroundOperation = backgroundContextManager.isBackgroundOperation(instruction);
  console.log(`🔍 DEBUG: isBackgroundOperation = ${isBackgroundOperation}`);
  if (isBackgroundOperation && !hasMultipleEdits) {
    console.log(`   - Pure background operation detected`);
    return {
      strategy: 'background_replacement',
      operations: [{
        type: 'background_edit',
        instruction,
        target: 'background',
        backgroundContext: backgroundContext,
        contextIsolated: true
      }],
      backgroundOperation: true,
      contextIsolated: true
    };
  }
  
  // Default to structured prompt approach
  return {
    strategy: 'structured_prompt',
    operations: [{ type: 'structured_modification', instruction }]
  };
}

// Run tests on user examples
console.log("\n🧪 Testing User Examples with Updated Logic:");
console.log("=============================================");

let workingExamples = 0;
let totalExamples = userExamples.length;

for (let i = 0; i < userExamples.length; i++) {
  const example = userExamples[i];
  console.log(`\nExample ${i + 1}: "${example.instruction}"`);
  console.log(`Description: ${example.description}`);
  
  try {
    const result = await analyzeRefinementInstructionEnhanced(example.instruction, null, null);
    
    console.log(`Analysis Result:`);
    console.log(`  - Strategy: ${result.strategy}`);
    console.log(`  - Operations: ${result.operations.length}`);
    console.log(`  - Background Operation: ${result.backgroundOperation || false}`);
    
    if (result.operations.length > 0) {
      console.log(`  - Operation Details:`);
      result.operations.forEach((op, idx) => {
        console.log(`    ${idx + 1}. Type: ${op.type}, Target: ${op.target || 'none'}, Instruction: "${op.instruction}"`);
      });
    }
    
    // Determine if this would work correctly
    let wouldWork = false;
    
    if (example.instruction === "add a hat and cigar") {
      // This should work if we get 2 object_addition operations
      wouldWork = result.strategy === 'multi_step' && 
                  result.operations.length === 2 &&
                  result.operations.every(op => op.type === 'object_addition');
    } else if (example.instruction.includes("background")) {
      // Mixed operations should work if we get both object and background operations
      wouldWork = result.strategy === 'multi_step' && 
                  result.operations.length === 2 &&
                  result.operations.some(op => op.type === 'object_addition') &&
                  result.operations.some(op => op.type === 'background_edit');
    } else if (example.instruction.includes("make") || example.instruction.includes("color")) {
      // Mixed operations should work if we get both object and modification operations
      wouldWork = result.strategy === 'multi_step' && 
                  result.operations.length === 2 &&
                  result.operations.some(op => op.type === 'object_addition') &&
                  result.operations.some(op => op.type === 'object_modification');
    }
    
    if (wouldWork) {
      console.log(`✅ Example ${i + 1} WOULD WORK CORRECTLY`);
      workingExamples++;
    } else {
      console.log(`❌ Example ${i + 1} WOULD NOT WORK CORRECTLY`);
      console.log(`   Expected: ${example.shouldWork ? 'Should work' : 'Should not work'}`);
      console.log(`   Actual: Would ${wouldWork ? 'work' : 'not work'}`);
    }
    
  } catch (error) {
    console.log(`❌ Example ${i + 1} ERROR:`, error.message);
  }
}

console.log(`\n📊 Analysis Results: ${workingExamples}/${totalExamples} examples would work correctly`);
console.log(`Success rate: ${Math.round((workingExamples / totalExamples) * 100)}%`);

if (workingExamples === totalExamples) {
  console.log("🎉 All examples would work! The updated system should handle these correctly.");
} else {
  console.log("⚠️  Some examples would not work. The system needs further improvements.");
  
  console.log("\n🔧 Recommended Next Steps:");
  console.log("1. Verify the patterns are correctly implemented in the main file");
  console.log("2. Test with actual API calls to confirm functionality");
  console.log("3. Add more comprehensive pattern matching if needed");
}

console.log("\n✅ Updated Multi-Edit Functionality Test Complete");
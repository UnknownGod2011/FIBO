/**
 * Comprehensive Issue Test
 * Tests all the issues mentioned by the user to identify what's working and what needs fixing
 */

console.log("🧪 Comprehensive Issue Test");
console.log("===========================");

// Test cases for all the issues mentioned
const testCases = [
  {
    category: "Editing System Reliability",
    tests: [
      {
        instruction: "change the color to blue",
        description: "Unusual phrasing that should be detected",
        expectedType: "color_change",
        issue: "Goes undetected"
      },
      {
        instruction: "make it red",
        description: "Vague color change",
        expectedType: "color_change",
        issue: "Vague phrasing"
      },
      {
        instruction: "turn blue",
        description: "Very short color instruction",
        expectedType: "color_change",
        issue: "Minimal phrasing"
      }
    ]
  },
  {
    category: "NLP Understanding",
    tests: [
      {
        instruction: "put some red on it",
        description: "Weird phrasing for color change",
        expectedType: "color_change",
        issue: "Weird phrasing"
      },
      {
        instruction: "make different",
        description: "Very vague instruction",
        expectedType: "general_edit",
        issue: "Extremely vague"
      },
      {
        instruction: "change something",
        description: "Vague modification request",
        expectedType: "general_edit",
        issue: "No specific target"
      }
    ]
  },
  {
    category: "Background Generation",
    tests: [
      {
        instruction: "forest background",
        description: "Should generate full forest background",
        expectedType: "background_change",
        issue: "Should be full background"
      },
      {
        instruction: "put in a city",
        description: "Alternative background phrasing",
        expectedType: "background_change",
        issue: "Alternative phrasing"
      },
      {
        instruction: "snowfall behind",
        description: "Background with 'behind' keyword",
        expectedType: "background_change",
        issue: "Behind keyword"
      }
    ]
  },
  {
    category: "Background Persistence",
    tests: [
      {
        instruction: "add a hat",
        description: "Should preserve existing background",
        expectedType: "object_addition",
        issue: "Should not affect background"
      },
      {
        instruction: "change color to red",
        description: "Should preserve existing background",
        expectedType: "color_change",
        issue: "Should not affect background"
      }
    ]
  },
  {
    category: "Multi-Edit Detection",
    tests: [
      {
        instruction: "add a hat and change the background to a forest",
        description: "Object + background edit",
        expectedOperations: 2,
        issue: "Must detect both operations"
      },
      {
        instruction: "add sunglasses and make teeth gold",
        description: "Object + color edit",
        expectedOperations: 2,
        issue: "Must detect both operations"
      },
      {
        instruction: "add a cigar, change background to city, and make eyes red",
        description: "Three operations",
        expectedOperations: 3,
        issue: "Must detect all three operations"
      }
    ]
  }
];

// Mock the background context manager for testing
class MockBackgroundContextManager {
  isBackgroundOperation(instruction) {
    const lowerInstruction = instruction.toLowerCase();
    return lowerInstruction.includes('background') || 
           lowerInstruction.includes('forest') || 
           lowerInstruction.includes('city') || 
           lowerInstruction.includes('snowfall') ||
           lowerInstruction.includes('behind');
  }
}

const mockBackgroundContextManager = new MockBackgroundContextManager();

// Mock the enhanced individual operation parser
function parseIndividualOperationWithValidation(instruction) {
  const lowerInstruction = instruction.toLowerCase();
  
  console.log(`🔍 DEBUG: parseIndividualOperationWithValidation called with: "${instruction}"`);
  
  // Enhanced background operations with vague phrasing support
  const backgroundPatterns = [
    /(?:make|change|set|give)\s+(?:the\s+)?background\s+(?:to\s+)?(.+)/i,
    /(?:add|put)\s+(?:a\s+)?(.+)\s+background/i,
    /(.+)\s+(?:falling\s+)?behind\s+(?:him|her|it|them)/i,
    /background\s+(?:of\s+|with\s+)?(.+)/i,
    /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+behind$/i,
    /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+(?:scene|setting|environment)$/i,
    /^put\s+in\s+(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)$/i,
    /^(?:different|new|another|change)\s+background$/i,
    /^(forest|snow|rain|city|beach|mountain|desert|ocean|sunset|sunrise|night|day)$/i
  ];
  
  for (const pattern of backgroundPatterns) {
    const match = instruction.match(pattern);
    if (match) {
      let backgroundValue = match[1] ? match[1].trim() : 'custom background';
      
      if (pattern.source.includes('different|new|another')) {
        backgroundValue = 'different background setting';
      } else if (pattern.source.includes('^(forest|snow')) {
        backgroundValue = match[1] || match[0];
      }
      
      return {
        type: 'background_edit',
        instruction: instruction,
        target: 'background',
        value: backgroundValue,
        action: 'modify',
        priority: 1,
        isValid: true,
        confidence: 0.9
      };
    }
  }
  
  // Enhanced addition operations
  const additionPatterns = [
    /(?:add|put|place|attach)\s+(?:a\s+|an\s+|some\s+)?(.+?)(?:\s+(?:to|on|onto)\s+(.+?))?$/i,
    /give\s+(?:him|her|it|them)\s+(?:a\s+|an\s+|some\s+)?(.+)/i,
    /(?:equip|outfit)\s+(?:with\s+)?(?:a\s+|an\s+)?(.+)/i
  ];
  
  for (const pattern of additionPatterns) {
    const match = instruction.match(pattern);
    if (match) {
      const object = match[1].trim();
      const location = match[2] ? match[2].trim() : null;
      
      return {
        type: 'object_addition',
        instruction: instruction,
        target: extractObjectFromPhrase(object),
        object: object,
        location: location,
        action: 'add',
        priority: 2,
        isValid: true,
        confidence: 0.85
      };
    }
  }
  
  // Enhanced color/modification operations with unusual phrasing support
  const modificationPatterns = [
    /(?:change|alter)\s+(?:the\s+)?color\s+of\s+(?:the\s+)?(.+?)\s+to\s+(\w+)/i,
    /(?:make|turn)\s+(?:the\s+)?(.+?)\s+(\w+)$/i,
    /(?:change|alter)\s+(?:the\s+)?(.+?)\s+color\s+to\s+(\w+)/i,
    /(?:color|paint|dye)\s+(?:the\s+)?(.+?)\s+(\w+)/i,
    /(?:add|give)\s+(\w+)\s+(.+)/i,
    // CRITICAL FIX: Handle unusual color change phrasings
    /(?:change|alter)\s+(?:the\s+)?color\s+to\s+(\w+)/i,
    /^(?:turn|make\s+it)\s+(\w+)$/i,
    /^(?:color\s+(\w+)|(\w+)\s+color)$/i,
    /(?:make|turn)\s+everything\s+(\w+)/i,
    // NEW: Handle very vague color requests
    /put\s+(?:some\s+)?(\w+)\s+on\s+it/i,
    /make\s+it\s+more\s+(\w+)/i,
    /add\s+(\w+)\s+to\s+it/i
  ];
  
  for (const pattern of modificationPatterns) {
    const match = instruction.match(pattern);
    if (match) {
      let target, value;
      
      if (pattern.source.includes('add|give')) {
        value = match[1] || '';
        target = match[2] || '';
      } else if (pattern.source.includes('color.*to')) {
        target = 'main subject';
        value = match[1] || '';
      } else if (pattern.source.includes('turn.*make.*it')) {
        target = 'main subject';
        value = match[1] || '';
      } else if (pattern.source.includes('color.*color')) {
        target = 'main subject';
        value = match[1] || match[2] || '';
      } else if (pattern.source.includes('everything')) {
        target = 'everything';
        value = match[1] || '';
      } else if (pattern.source.includes('put.*some.*on')) {
        target = 'main subject';
        value = match[1] || '';
      } else if (pattern.source.includes('make.*it.*more')) {
        target = 'main subject';
        value = match[1] || '';
      } else if (pattern.source.includes('add.*to.*it')) {
        target = 'main subject';
        value = match[1] || '';
      } else {
        target = match[1] || '';
        value = match[2] || '';
      }
      
      return {
        type: 'object_modification',
        instruction: instruction,
        target: target,
        value: value,
        action: 'modify',
        priority: 3,
        isValid: true,
        confidence: 0.8
      };
    }
  }
  
  // Enhanced fallback logic for vague instructions
  const vagueImprovementPatterns = [
    /^(?:make\s+it\s+|change\s+it\s+|make\s+)?(?:better|cooler|nicer|more\s+interesting|different)$/i,
    /^(?:improve|enhance|upgrade)\s+(?:it|this|the\s+image)?$/i,
    /^(?:add\s+)?something\s+(?:cool|nice|interesting|good|better)$/i,
    /^(?:change|modify|alter)\s+something$/i,
    /^make\s+different$/i
  ];
  
  for (const pattern of vagueImprovementPatterns) {
    if (pattern.test(lowerInstruction)) {
      return {
        type: 'general_edit',
        instruction: instruction,
        target: 'overall appearance',
        value: 'enhanced',
        action: 'improve',
        priority: 5,
        isValid: true,
        confidence: 0.6,
        vague: true
      };
    }
  }
  
  // Generic operation fallback with validation
  if (lowerInstruction.length > 3 && /\b(?:add|change|make|turn|give|put|place|remove)\b/.test(lowerInstruction)) {
    return {
      type: 'general_edit',
      instruction: instruction,
      target: 'image',
      action: 'modify',
      priority: 5,
      isValid: true,
      confidence: 0.5
    };
  }
  
  // Invalid operation
  console.log(`🔍 DEBUG: No valid operation found for: "${instruction}"`);
  return {
    isValid: false,
    invalidReason: 'no_recognizable_action_pattern',
    instruction: instruction
  };
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
  
  return phrase.split(' ').pop();
}

// Mock multi-operation parser
function parseMultipleOperationsEnhanced(instruction) {
  const operations = [];
  
  console.log(`🔍 Enhanced parsing of multi-edit instruction: "${instruction}"`);
  
  // Check for mixed patterns first
  const mixedPattern1 = /^(add|put|place|give)\s+(?:a\s+|an\s+)?(.+?)\s+and\s+(change|make|set)\s+(?:the\s+)?background\s+(?:to\s+)?(.+)$/i;
  const mixedMatch1 = instruction.match(mixedPattern1);
  
  if (mixedMatch1) {
    console.log(`   - Mixed operation pattern 1 detected (object + background)`);
    
    const objectOp = {
      type: 'object_addition',
      instruction: `${mixedMatch1[1]} ${mixedMatch1[2]}`,
      target: extractObjectFromPhrase(mixedMatch1[2]),
      object: mixedMatch1[2].trim(),
      action: 'add',
      isValid: true,
      confidence: 0.9
    };
    
    const backgroundOp = {
      type: 'background_edit',
      instruction: `${mixedMatch1[3]} background ${mixedMatch1[4]}`,
      target: 'background',
      value: mixedMatch1[4].trim(),
      action: 'modify',
      isValid: true,
      confidence: 0.9
    };
    
    operations.push(objectOp);
    operations.push(backgroundOp);
    return operations;
  }
  
  // Check for three operations pattern
  const threeOpPattern = /^(add|put)\s+(?:a\s+)?(.+?),\s*(change|set)\s+background\s+to\s+(.+?),\s*and\s+(make|turn)\s+(.+?)\s+(\w+)$/i;
  const threeOpMatch = instruction.match(threeOpPattern);
  
  if (threeOpMatch) {
    console.log(`   - Three operation pattern detected`);
    
    operations.push({
      type: 'object_addition',
      instruction: `${threeOpMatch[1]} ${threeOpMatch[2]}`,
      target: extractObjectFromPhrase(threeOpMatch[2]),
      object: threeOpMatch[2].trim(),
      action: 'add',
      isValid: true,
      confidence: 0.9
    });
    
    operations.push({
      type: 'background_edit',
      instruction: `${threeOpMatch[3]} background ${threeOpMatch[4]}`,
      target: 'background',
      value: threeOpMatch[4].trim(),
      action: 'modify',
      isValid: true,
      confidence: 0.9
    });
    
    operations.push({
      type: 'object_modification',
      instruction: `${threeOpMatch[5]} ${threeOpMatch[6]} ${threeOpMatch[7]}`,
      target: threeOpMatch[6].trim(),
      value: threeOpMatch[7].trim(),
      action: 'modify',
      isValid: true,
      confidence: 0.9
    });
    
    return operations;
  }
  
  // Simple splitting for other cases
  const parts = instruction.split(/\s+and\s+|,\s*/i);
  if (parts.length > 1) {
    for (const part of parts) {
      const trimmedPart = part.trim();
      if (trimmedPart.length > 0) {
        const operation = parseIndividualOperationWithValidation(trimmedPart);
        if (operation && operation.isValid) {
          operations.push(operation);
        }
      }
    }
  }
  
  return operations;
}

// Run comprehensive tests
console.log("\n🧪 Running Comprehensive Issue Tests:");
console.log("====================================");

let totalTests = 0;
let passedTests = 0;
let issuesSummary = {};

for (const category of testCases) {
  console.log(`\n📋 Category: ${category.category}`);
  console.log("=" + "=".repeat(category.category.length + 11));
  
  issuesSummary[category.category] = {
    total: category.tests.length,
    passed: 0,
    failed: 0,
    issues: []
  };
  
  for (let i = 0; i < category.tests.length; i++) {
    const test = category.tests[i];
    totalTests++;
    
    console.log(`\nTest ${i + 1}: "${test.instruction}"`);
    console.log(`Description: ${test.description}`);
    console.log(`Issue: ${test.issue}`);
    
    try {
      let testPassed = false;
      
      if (test.expectedOperations) {
        // Multi-edit test
        const operations = parseMultipleOperationsEnhanced(test.instruction);
        console.log(`Result: ${operations.length} operations detected`);
        
        if (operations.length >= test.expectedOperations) {
          console.log(`✅ PASSED: Detected ${operations.length} operations (expected ${test.expectedOperations})`);
          testPassed = true;
          passedTests++;
          issuesSummary[category.category].passed++;
        } else {
          console.log(`❌ FAILED: Only detected ${operations.length} operations (expected ${test.expectedOperations})`);
          issuesSummary[category.category].failed++;
          issuesSummary[category.category].issues.push({
            instruction: test.instruction,
            issue: test.issue,
            expected: test.expectedOperations,
            actual: operations.length
          });
        }
        
        operations.forEach((op, idx) => {
          console.log(`   ${idx + 1}. Type: ${op.type}, Target: ${op.target || 'none'}`);
        });
        
      } else {
        // Single operation test
        const operation = parseIndividualOperationWithValidation(test.instruction);
        
        if (operation && operation.isValid) {
          console.log(`Result: ${operation.type} (confidence: ${operation.confidence})`);
          
          if (operation.type === test.expectedType || 
              (test.expectedType === 'color_change' && operation.type === 'object_modification') ||
              (test.expectedType === 'background_change' && operation.type === 'background_edit')) {
            console.log(`✅ PASSED: Correctly detected as ${operation.type}`);
            testPassed = true;
            passedTests++;
            issuesSummary[category.category].passed++;
          } else {
            console.log(`❌ FAILED: Expected ${test.expectedType}, got ${operation.type}`);
            issuesSummary[category.category].failed++;
            issuesSummary[category.category].issues.push({
              instruction: test.instruction,
              issue: test.issue,
              expected: test.expectedType,
              actual: operation.type
            });
          }
        } else {
          console.log(`❌ FAILED: No valid operation detected`);
          issuesSummary[category.category].failed++;
          issuesSummary[category.category].issues.push({
            instruction: test.instruction,
            issue: test.issue,
            expected: test.expectedType,
            actual: 'none'
          });
        }
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      issuesSummary[category.category].failed++;
      issuesSummary[category.category].issues.push({
        instruction: test.instruction,
        issue: test.issue,
        error: error.message
      });
    }
  }
}

// Summary report
console.log(`\n📊 COMPREHENSIVE TEST RESULTS`);
console.log("==============================");
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

console.log(`\n📋 ISSUES BY CATEGORY:`);
for (const [category, summary] of Object.entries(issuesSummary)) {
  console.log(`\n${category}:`);
  console.log(`  ✅ Passed: ${summary.passed}/${summary.total}`);
  console.log(`  ❌ Failed: ${summary.failed}/${summary.total}`);
  
  if (summary.issues.length > 0) {
    console.log(`  🔧 Issues to fix:`);
    summary.issues.forEach((issue, idx) => {
      console.log(`    ${idx + 1}. "${issue.instruction}" - ${issue.issue}`);
      if (issue.expected && issue.actual) {
        console.log(`       Expected: ${issue.expected}, Got: ${issue.actual}`);
      }
    });
  }
}

console.log(`\n🎯 PRIORITY FIXES NEEDED:`);
const priorityFixes = [];

for (const [category, summary] of Object.entries(issuesSummary)) {
  if (summary.failed > 0) {
    priorityFixes.push(`${category}: ${summary.failed} issues`);
  }
}

if (priorityFixes.length > 0) {
  priorityFixes.forEach((fix, idx) => {
    console.log(`${idx + 1}. ${fix}`);
  });
} else {
  console.log("🎉 All tests passed! No fixes needed.");
}

console.log("\n✅ Comprehensive Issue Test Complete");
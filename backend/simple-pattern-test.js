/**
 * Simple Pattern Test
 * Test the exact function from the main file
 */

console.log("🔍 Simple Pattern Test");
console.log("======================");

// Copy the exact function from the main file
function parseIndividualOperationWithValidation(instruction) {
  const lowerInstruction = instruction.toLowerCase();
  
  console.log(`🔍 DEBUG: parseIndividualOperationWithValidation called with: "${instruction}"`);
  
  // Enhanced background operations with vague phrasing support
  const backgroundPatterns = [
    /(?:make|change|set|give)\s+(?:the\s+)?background\s+(?:to\s+)?(.+)/i,
    /(?:add|put)\s+(?:a\s+)?(.+)\s+background/i,
    /(.+)\s+(?:falling\s+)?behind\s+(?:him|her|it|them)/i,
    /background\s+(?:of\s+|with\s+)?(.+)/i,
    
    // CRITICAL FIX: Handle vague background requests
    // "forest behind" - detect environment words followed by "behind"
    /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+behind$/i,
    
    // "forest scene" - detect environment + scene/setting
    /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+(?:scene|setting|environment)$/i,
    
    // "put in forest" - detect "put in [environment]"
    /^put\s+in\s+(?:a\s+)?(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)$/i,
    
    // "different background" - handle vague background changes
    /^(?:different|new|another|change)\s+background$/i,
    
    // CRITICAL FIX: "forest background" - environment + background
    /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+background$/i,
    
    // CRITICAL FIX: "snowfall behind" - environment + behind (without pronouns)
    /^(forest|snow|snowfall|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+behind$/i,
    
    // Single environment words that likely mean background
    /^(forest|snow|rain|city|beach|mountain|desert|ocean|sunset|sunrise|night|day)$/i
  ];
  
  console.log(`   - Checking ${backgroundPatterns.length} background patterns...`);
  
  for (let i = 0; i < backgroundPatterns.length; i++) {
    const pattern = backgroundPatterns[i];
    const match = instruction.match(pattern);
    console.log(`   - Pattern ${i + 1}: ${pattern.source.substring(0, 50)}... -> ${match ? 'MATCH' : 'no match'}`);
    if (match) {
      let backgroundValue = match[1] ? match[1].trim() : 'custom background';
      
      // Handle special cases for vague background requests
      if (pattern.source.includes('different|new|another')) {
        backgroundValue = 'different background setting';
      } else if (pattern.source.includes('^(forest|snow')) {
        // Single environment word - use as is
        backgroundValue = match[1] || match[0];
      }
      
      console.log(`   - ✅ RETURNING background_edit with value: "${backgroundValue}"`);
      
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
  
  console.log(`   - No background patterns matched, checking addition patterns...`);
  
  // Enhanced addition operations with comprehensive patterns
  const additionPatterns = [
    /(?:add|put|place|attach)\s+(?:a\s+|an\s+|some\s+)?(.+?)(?:\s+(?:to|on|onto)\s+(.+?))?$/i,
    /give\s+(?:him|her|it|them)\s+(?:a\s+|an\s+|some\s+)?(.+)/i,
    /(?:equip|outfit)\s+(?:with\s+)?(?:a\s+|an\s+)?(.+)/i
  ];
  
  for (let i = 0; i < additionPatterns.length; i++) {
    const pattern = additionPatterns[i];
    const match = instruction.match(pattern);
    console.log(`   - Addition Pattern ${i + 1}: ${pattern.source.substring(0, 50)}... -> ${match ? 'MATCH' : 'no match'}`);
    if (match) {
      const object = match[1].trim();
      const location = match[2] ? match[2].trim() : null;
      
      console.log(`   - ✅ RETURNING object_addition with object: "${object}"`);
      
      return {
        type: 'object_addition',
        instruction: instruction,
        target: object,
        object: object,
        location: location,
        action: 'add',
        priority: 2,
        isValid: true,
        confidence: 0.85
      };
    }
  }
  
  console.log(`   - No patterns matched, returning invalid`);
  
  return {
    isValid: false,
    invalidReason: 'no_recognizable_action_pattern',
    instruction: instruction
  };
}

// Test the problematic cases
const testCases = [
  "forest background",
  "put in a city", 
  "snowfall behind",
  "put some red on it"
];

for (const testCase of testCases) {
  console.log(`\n🧪 Testing: "${testCase}"`);
  console.log("=" + "=".repeat(testCase.length + 11));
  
  const result = parseIndividualOperationWithValidation(testCase);
  
  console.log(`Result:`, {
    type: result.type,
    isValid: result.isValid,
    target: result.target,
    value: result.value || result.object,
    confidence: result.confidence
  });
}

console.log("\n✅ Simple Pattern Test Complete");
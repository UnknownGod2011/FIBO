/**
 * Debug Pattern Matching
 * Test individual patterns to see why they're not working
 */

console.log("🔍 Debug Pattern Matching");
console.log("=========================");

// Test the problematic instructions
const testInstructions = [
  "put some red on it",
  "forest background", 
  "put in a city",
  "snowfall behind"
];

// Test background patterns
const backgroundPatterns = [
  { pattern: /(?:make|change|set|give)\s+(?:the\s+)?background\s+(?:to\s+)?(.+)/i, name: "background to X" },
  { pattern: /(?:add|put)\s+(?:a\s+)?(.+)\s+background/i, name: "add X background" },
  { pattern: /(.+)\s+(?:falling\s+)?behind\s+(?:him|her|it|them)/i, name: "X behind pronouns" },
  { pattern: /background\s+(?:of\s+|with\s+)?(.+)/i, name: "background of X" },
  { pattern: /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+behind$/i, name: "environment behind" },
  { pattern: /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+(?:scene|setting|environment)$/i, name: "environment scene" },
  { pattern: /^put\s+in\s+(?:a\s+)?(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)$/i, name: "put in environment" },
  { pattern: /^(?:different|new|another|change)\s+background$/i, name: "different background" },
  { pattern: /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+background$/i, name: "environment background" },
  { pattern: /^(forest|snow|snowfall|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+behind$/i, name: "environment behind (no pronouns)" },
  { pattern: /^(forest|snow|rain|city|beach|mountain|desert|ocean|sunset|sunrise|night|day)$/i, name: "single environment word" }
];

// Test modification patterns
const modificationPatterns = [
  { pattern: /(?:change|alter)\s+(?:the\s+)?color\s+of\s+(?:the\s+)?(.+?)\s+to\s+(\w+)/i, name: "change color of X to Y" },
  { pattern: /(?:make|turn)\s+(?:the\s+)?(.+?)\s+(\w+)$/i, name: "make X Y" },
  { pattern: /(?:change|alter)\s+(?:the\s+)?(.+?)\s+color\s+to\s+(\w+)/i, name: "change X color to Y" },
  { pattern: /(?:color|paint|dye)\s+(?:the\s+)?(.+?)\s+(\w+)/i, name: "color X Y" },
  { pattern: /(?:add|give)\s+(\w+)\s+(.+)/i, name: "add Y X (reverse)" },
  { pattern: /(?:change|alter)\s+(?:the\s+)?color\s+to\s+(\w+)/i, name: "change color to Y" },
  { pattern: /^(?:turn|make\s+it)\s+(\w+)$/i, name: "turn Y" },
  { pattern: /^(?:color\s+(\w+)|(\w+)\s+color)$/i, name: "color Y or Y color" },
  { pattern: /(?:make|turn)\s+everything\s+(\w+)/i, name: "make everything Y" },
  { pattern: /put\s+(?:some\s+)?(\w+)\s+on\s+it/i, name: "put Y on it" },
  { pattern: /make\s+it\s+more\s+(\w+)/i, name: "make it more Y" },
  { pattern: /add\s+(\w+)\s+to\s+it/i, name: "add Y to it" }
];

// Test addition patterns
const additionPatterns = [
  { pattern: /(?:add|put|place|attach)\s+(?:a\s+|an\s+|some\s+)?(.+?)(?:\s+(?:to|on|onto)\s+(.+?))?$/i, name: "add X" },
  { pattern: /give\s+(?:him|her|it|them)\s+(?:a\s+|an\s+|some\s+)?(.+)/i, name: "give X" },
  { pattern: /(?:equip|outfit)\s+(?:with\s+)?(?:a\s+|an\s+)?(.+)/i, name: "equip with X" }
];

console.log("\n🧪 Testing Background Patterns:");
console.log("===============================");

for (const instruction of testInstructions) {
  if (instruction.includes('background') || instruction.includes('behind') || instruction.includes('city') || instruction.includes('forest') || instruction.includes('snowfall')) {
    console.log(`\nTesting: "${instruction}"`);
    
    let matched = false;
    for (const { pattern, name } of backgroundPatterns) {
      const match = instruction.match(pattern);
      if (match) {
        console.log(`  ✅ Matched: ${name}`);
        console.log(`     Pattern: ${pattern.source}`);
        console.log(`     Groups: [${match.slice(1).join(', ')}]`);
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      console.log(`  ❌ No background pattern matched`);
    }
  }
}

console.log("\n🧪 Testing Modification Patterns:");
console.log("=================================");

for (const instruction of testInstructions) {
  if (instruction.includes('red') || instruction.includes('color')) {
    console.log(`\nTesting: "${instruction}"`);
    
    let matched = false;
    for (const { pattern, name } of modificationPatterns) {
      const match = instruction.match(pattern);
      if (match) {
        console.log(`  ✅ Matched: ${name}`);
        console.log(`     Pattern: ${pattern.source}`);
        console.log(`     Groups: [${match.slice(1).join(', ')}]`);
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      console.log(`  ❌ No modification pattern matched`);
    }
  }
}

console.log("\n🧪 Testing Addition Patterns:");
console.log("=============================");

for (const instruction of testInstructions) {
  console.log(`\nTesting: "${instruction}"`);
  
  let matched = false;
  for (const { pattern, name } of additionPatterns) {
    const match = instruction.match(pattern);
    if (match) {
      console.log(`  ✅ Matched: ${name}`);
      console.log(`     Pattern: ${pattern.source}`);
      console.log(`     Groups: [${match.slice(1).join(', ')}]`);
      matched = true;
      break;
    }
  }
  
  if (!matched) {
    console.log(`  ❌ No addition pattern matched`);
  }
}

console.log("\n✅ Pattern Debug Complete");
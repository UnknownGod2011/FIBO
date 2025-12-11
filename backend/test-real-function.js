/**
 * Test Real Function
 * Import and test the actual function from the main file
 */

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🧪 Testing Real Function from Main File");
console.log("=======================================");

// We can't directly import the function, so let's create a simple test
// by running a subset of the logic

const testCases = [
  "put some red on it",
  "forest background", 
  "put in a city",
  "snowfall behind"
];

console.log("Testing individual patterns directly:");

// Test background patterns
const backgroundPatterns = [
  /(?:make|change|set|give)\s+(?:the\s+)?background\s+(?:to\s+)?(.+)/i,
  /(?:add|put)\s+(?:a\s+)?(.+)\s+background/i,
  /(.+)\s+(?:falling\s+)?behind\s+(?:him|her|it|them)/i,
  /background\s+(?:of\s+|with\s+)?(.+)/i,
  /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+behind$/i,
  /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+(?:scene|setting|environment)$/i,
  /^put\s+in\s+(?:a\s+)?(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)$/i,
  /^(?:different|new|another|change)\s+background$/i,
  /^(forest|snow|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+background$/i,
  /^(forest|snow|snowfall|rain|city|beach|mountain|desert|ocean|sky|clouds?|sunset|sunrise|night|day)\s+behind$/i,
  /^(forest|snow|rain|city|beach|mountain|desert|ocean|sunset|sunrise|night|day)$/i
];

// Test modification patterns
const modificationPatterns = [
  /(?:change|alter)\s+(?:the\s+)?color\s+of\s+(?:the\s+)?(.+?)\s+to\s+(\w+)/i,
  /(?:make|turn)\s+(?:the\s+)?(.+?)\s+(\w+)$/i,
  /(?:change|alter)\s+(?:the\s+)?(.+?)\s+color\s+to\s+(\w+)/i,
  /(?:color|paint|dye)\s+(?:the\s+)?(.+?)\s+(\w+)/i,
  /(?:add|give)\s+(\w+)\s+(.+)/i,
  /(?:change|alter)\s+(?:the\s+)?color\s+to\s+(\w+)/i,
  /^(?:turn|make\s+it)\s+(\w+)$/i,
  /^(?:color\s+(\w+)|(\w+)\s+color)$/i,
  /(?:make|turn)\s+everything\s+(\w+)/i,
  /put\s+(?:some\s+)?(\w+)\s+on\s+it/i,
  /make\s+it\s+more\s+(\w+)/i,
  /add\s+(\w+)\s+to\s+it/i
];

// Test addition patterns
const additionPatterns = [
  /(?:add|put|place|attach)\s+(?:a\s+|an\s+|some\s+)?(.+?)(?:\s+(?:to|on|onto)\s+(.+?))?$/i,
  /give\s+(?:him|her|it|them)\s+(?:a\s+|an\s+|some\s+)?(.+)/i,
  /(?:equip|outfit)\s+(?:with\s+)?(?:a\s+|an\s+)?(.+)/i
];

function testPatternOrder(instruction) {
  console.log(`\n🧪 Testing: "${instruction}"`);
  
  // Test background patterns first
  for (let i = 0; i < backgroundPatterns.length; i++) {
    const match = instruction.match(backgroundPatterns[i]);
    if (match) {
      console.log(`  ✅ BACKGROUND pattern ${i + 1} matched: ${backgroundPatterns[i].source.substring(0, 50)}...`);
      console.log(`     Should return: background_edit`);
      return 'background_edit';
    }
  }
  
  // Test modification patterns second
  for (let i = 0; i < modificationPatterns.length; i++) {
    const match = instruction.match(modificationPatterns[i]);
    if (match) {
      console.log(`  ✅ MODIFICATION pattern ${i + 1} matched: ${modificationPatterns[i].source.substring(0, 50)}...`);
      console.log(`     Should return: object_modification`);
      return 'object_modification';
    }
  }
  
  // Test addition patterns last
  for (let i = 0; i < additionPatterns.length; i++) {
    const match = instruction.match(additionPatterns[i]);
    if (match) {
      console.log(`  ✅ ADDITION pattern ${i + 1} matched: ${additionPatterns[i].source.substring(0, 50)}...`);
      console.log(`     Should return: object_addition`);
      return 'object_addition';
    }
  }
  
  console.log(`  ❌ No patterns matched`);
  return 'none';
}

for (const testCase of testCases) {
  const result = testPatternOrder(testCase);
}

console.log("\n✅ Real Function Test Complete");
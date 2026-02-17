/**
 * Antigravity AI Debug System - Cleanup Script
 * 
 * Removes all injected debug code blocks from source files
 * Usage: node scripts/antigravity-cleanup.js [pattern]
 */

const fs = require("fs");
const path = require("path");
const glob = require("globby");

// Pattern to match debug code blocks
const DEBUG_PATTERN = /\/\/\s*#region\s+agent\s+log[\s\S]*?\/\/\s*#endregion\s*\n?/g;

// Default file patterns to search
const DEFAULT_PATTERNS = [
  "**/*.ts",
  "**/*.tsx",
  "**/*.js",
  "**/*.jsx"
];

// Directories to exclude
const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  ".antigravity",
  ".git",
  "dist",
  "build",
  "out"
];

async function cleanupFiles(filePatterns = DEFAULT_PATTERNS) {
  console.log("🧹 Starting cleanup of Antigravity debug code...\n");
  
  // Get all matching files
  const files = await glob(filePatterns, {
    ignore: EXCLUDE_DIRS.map(dir => `**/${dir}/**`),
    absolute: false
  });
  
  console.log(`📁 Found ${files.length} files to check\n`);
  
  let totalRemoved = 0;
  let filesModified = 0;
  
  for (const file of files) {
    try {
      const filePath = path.resolve(file);
      
      // Skip if file doesn't exist
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      const content = fs.readFileSync(filePath, "utf8");
      const matches = content.match(DEBUG_PATTERN);
      
      if (matches && matches.length > 0) {
        const cleanedContent = content.replace(DEBUG_PATTERN, "");
        
        // Only write if content changed
        if (cleanedContent !== content) {
          fs.writeFileSync(filePath, cleanedContent, "utf8");
          filesModified++;
          totalRemoved += matches.length;
          console.log(`✅ Cleaned ${matches.length} block(s) from: ${file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\n✨ Cleanup complete!`);
  console.log(`   Files modified: ${filesModified}`);
  console.log(`   Debug blocks removed: ${totalRemoved}`);
  
  if (filesModified === 0) {
    console.log(`\n💡 No debug code found. All clean!`);
  }
}

// Run cleanup
const args = process.argv.slice(2);
const patterns = args.length > 0 ? args : DEFAULT_PATTERNS;

cleanupFiles(patterns).catch(error => {
  console.error("❌ Cleanup failed:", error);
  process.exit(1);
});

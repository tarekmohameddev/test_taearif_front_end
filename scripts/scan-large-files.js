// node scripts/scan-large-files.js

import fs from "fs";
import path from "path";

const ROOT_DIR = "./";
const MAX_LINES = 500;
const MAX_CHARS = 20000;

const OUTPUT_FILE = "./scripts/large-files-report.txt";
let results = [];

function scan(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    console.warn(`Skipping directory ${dir}: ${err.message}`);
    return;
  }

  for (const file of files) {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (err) {
      // Windows can fail on Unicode/special filenames from readdir
      console.warn(`Skipping ${fullPath}: ${err.message}`);
      continue;
    }

    if (stat.isDirectory()) {
      if (["node_modules", ".next", ".git", "docs", "trash"].includes(file)) continue;
      scan(fullPath);
    } else {
      if (!/\.(js|ts|tsx)$/.test(file)) continue;

      try {
        const content = fs.readFileSync(fullPath, "utf8");
        const lines = content.split("\n").length;
        const chars = content.length;

        if (lines > MAX_LINES || chars > MAX_CHARS) {
          results.push({
            file: fullPath,
            lines,
            chars,
          });
        }
      } catch (err) {
        console.warn(`Skipping read ${fullPath}: ${err.message}`);
      }
    }
  }
}

scan(ROOT_DIR);

// ترتيب من الأكبر للأصغر حسب عدد الأسطر
results.sort((a, b) => b.lines - a.lines);

let output = "=== Large Files Report ===\n\n";

for (const r of results) {
  output += `File: ${r.file}\n`;
  output += `Lines: ${r.lines}\n`;
  output += `Characters: ${r.chars}\n`;
  output += "-----------------------------------\n";
}

fs.writeFileSync(OUTPUT_FILE, output);

console.log(`Report generated: ${OUTPUT_FILE}`);
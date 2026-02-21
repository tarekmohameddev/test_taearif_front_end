// Run: node scripts/GetTopFilesByLines.mjs
import fg from "fast-glob";
import fs from "fs";
import path from "path";

(async () => {
  const files = await fg([
    "**/*",
    "!node_modules/**",
    "!**/fonts/**",
    "!**/public/**",
    "!**/*.{jpg,jpeg,png,gif,webp,svg,ico,mp4}",
    "!package-lock.json",
    "!yarn.lock",
    "!pnpm-lock.yaml",
  ], {
    onlyFiles: true,
    stats: false,
  });

  // Get file line counts and create array of {path, lines}
  const filesWithLines = files.map((filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n").length;
      return {
        path: filePath,
        lines: lines,
      };
    } catch (error) {
      return {
        path: filePath,
        lines: 0,
      };
    }
  });

  // Sort by line count (largest first) and take top 35
  const topFilesByLines = filesWithLines
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 35);

  // Format the output
  const output = topFilesByLines
    .map((file, index) => {
      return `${index + 1}. ${file.path}\n   Lines: ${file.lines}`;
    })
    .join("\n\n");

  // Write to file
  fs.writeFileSync(
    "top_files_by_lines.txt",
    `Top 35 Files by Line Count:\n\n${output}`,
    "utf-8"
  );

  console.log("✅ Top files by line count saved to top_files_by_lines.txt");
})();

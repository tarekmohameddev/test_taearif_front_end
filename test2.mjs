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
    // Skip files from top20_largest_files.txt (lines 3-16 and 21-37)
    "!package-lock.json",
    "!yarn.lock",
    "!pnpm-lock.yaml",
    "!lib/i18n/locales/ar.json",
    "!componentsStructure/translationHelper.ts",
    "!lib/i18n/locales/en.json",
    "!lib/i18n/locales/ar.json.backup",
    "!lib/defaultData.json",
    "!lib/themes/theme1Data.json",
    "!lib/oldDefaultData.json",
    "!lib/themes/theme2Data.json",
  ], {
    onlyFiles: true,
    stats: false,
  });

  // Get file sizes and create array of {path, size}
  const filesWithSizes = files.map((filePath) => {
    try {
      const stats = fs.statSync(filePath);
      return {
        path: filePath,
        size: stats.size,
      };
    } catch (error) {
      return {
        path: filePath,
        size: 0,
      };
    }
  });

  // Sort by size (largest first) and take top 20
  const top20LargestFiles = filesWithSizes
    .sort((a, b) => b.size - a.size)
    .slice(0, 35);

  // Format the output
  const output = top20LargestFiles
    .map((file, index) => {
      const sizeInKB = (file.size / 1024).toFixed(2);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      return `${index + 1}. ${file.path}\n   Size: ${file.size} bytes (${sizeInKB} KB / ${sizeInMB} MB)`;
    })
    .join("\n\n");

  // Write to file
  fs.writeFileSync(
    "top20_largest_files.txt",
    `Top 20 Largest Files in Project:\n\n${output}`,
    "utf-8"
  );

  console.log("✅ Top 20 largest files saved to top20_largest_files.txt");
})();

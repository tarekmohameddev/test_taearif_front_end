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
    .slice(0, 20);

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

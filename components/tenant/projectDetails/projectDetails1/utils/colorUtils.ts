/**
 * Get a darker shade of a hex color
 * @param hex - The hex color string (e.g., "#059669")
 * @param amount - The amount to darken (default: 20)
 * @returns The darker hex color string
 */
export const getDarkerColor = (hex: string, amount: number = 20): string => {
  if (!hex || !hex.startsWith("#")) return "#047857";
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6) return "#047857";

  const r = Math.max(
    0,
    Math.min(255, parseInt(cleanHex.substr(0, 2), 16) - amount),
  );
  const g = Math.max(
    0,
    Math.min(255, parseInt(cleanHex.substr(2, 2), 16) - amount),
  );
  const b = Math.max(
    0,
    Math.min(255, parseInt(cleanHex.substr(4, 2), 16) - amount),
  );

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

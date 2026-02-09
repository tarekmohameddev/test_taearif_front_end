export const getTransactionTypeLabel = (
  transactionType?: string | null,
  transactionTypeEn?: string | null,
) => {
  const normalized = transactionType?.trim().toLowerCase();
  const normalizedEn = transactionTypeEn?.trim().toLowerCase();

  if (
    normalizedEn === "rent" ||
    normalizedEn === "lease" ||
    normalized === "rent" ||
    normalized === "للإيجار" ||
    normalized?.includes("إيجار") ||
    normalized?.includes("ايجار")
  ) {
    return "للإيجار";
  }

  return "للبيع";
};

// Helper function to create darker color for hover states
export const getDarkerColor = (hex: string, amount: number = 20): string => {
  if (!hex || !hex.startsWith("#")) return "#6b4a3a";
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6) return "#6b4a3a";

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

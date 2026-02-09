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

// دوال التنسيق المشتركة

/**
 * تنسيق التاريخ إلى نص عربي
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "غير محدد";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "تاريخ غير صحيح";
  }
}

/**
 * تنسيق العملة إلى نص عربي
 */
export function formatCurrency(
  amount: number | string | null,
  currency: string = "SAR",
): string {
  if (!amount && amount !== 0) return "غير محدد";
  try {
    const numAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "مبلغ غير صحيح";
    return new Intl.NumberFormat("ar-US", {
      style: "currency",
      currency: currency,
    }).format(numAmount);
  } catch {
    return "مبلغ غير صحيح";
  }
}

/**
 * حساب الأيام المتبقية حتى تاريخ معين
 */
export function calculateDaysRemaining(dateString: string | null): number {
  if (!dateString) return 0;
  try {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * حساب الأيام المتأخرة منذ تاريخ معين
 */
export function calculateDaysOverdue(dateString: string | null): number {
  if (!dateString) return 0;
  try {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

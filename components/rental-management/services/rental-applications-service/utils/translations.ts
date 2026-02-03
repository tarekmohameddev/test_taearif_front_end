export const translateContractStatus = (id: string): string => {
  const translations: { [key: string]: string } = {
    pending: "قيد الانتظار",
    active: "نشط",
    expired: "منتهي",
    terminated: "ملغي",
  };
  return translations[id] || id;
};

export const translateRentalStatus = (id: string): string => {
  const translations: { [key: string]: string } = {
    active: "نشط",
    inactive: "غير نشط",
    terminated: "ملغي",
    ended: "منتهي",
    cancelled: "ملغي",
    draft: "مسودة",
  };
  return translations[id] || id;
};

export const translatePaymentStatus = (id: string): string => {
  const translations: { [key: string]: string } = {
    paid: "مدفوع",
    partial: "جزئي",
    overdue: "متأخر",
    pending: "قيد الانتظار",
    unpaid: "غير مدفوع",
  };
  return translations[id] || id;
};

export const translatePayingPlan = (id: string): string => {
  const translations: { [key: string]: string } = {
    monthly: "شهري",
    quarterly: "ربع سنوي",
    semi_annual: "نصف سنوي",
    annual: "سنوي",
  };
  return translations[id] || id;
};

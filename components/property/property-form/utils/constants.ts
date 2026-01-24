// قائمة المرافق
export const facilitiesList = [
  { key: "bedrooms", label: "غرف النوم" },
  { key: "bathrooms", label: "غرف الحمام" },
  { key: "rooms", label: "الغرف" },
  { key: "floors", label: "الأدوار" },
  { key: "floor_number", label: "رقم الدور" },
  { key: "driver_room", label: "غرفة السائق" },
  { key: "maid_room", label: "غرفة الخادمات" },
  { key: "dining_room", label: "غرفة الطعام" },
  { key: "living_room", label: "الصالة" },
  { key: "majlis", label: "المجلس" },
  { key: "storage_room", label: "المخزن" },
  { key: "basement", label: "القبو" },
  { key: "swimming_pool", label: "المسبح" },
  { key: "kitchen", label: "المطبخ" },
  { key: "balcony", label: "الشرفة" },
  { key: "garden", label: "الحديقة" },
  { key: "annex", label: "الملحق" },
  { key: "elevator", label: "المصعد" },
  { key: "private_parking", label: "موقف سيارة مخصص" },
];

// Generate years array
export const generateYears = (): number[] => {
  const years: number[] = [];
  for (let year = 2030; year >= 1925; year--) {
    years.push(year);
  }
  return years;
};

// Map field names to display names
export const fieldMap: Record<string, string> = {
  title: "اسم الوحدة",
  address: "العنوان",
  description: "الوصف",
  city_id: "المدينة",
  purpose: "نوع المعاملة",
  type: "نوع الوحدة",
  area: "المساحة",
};

export const getFieldDisplayName = (fieldName: string): string => {
  return fieldMap[fieldName] || fieldName;
};

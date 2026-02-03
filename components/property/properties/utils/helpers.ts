export const getPaymentMethodText = (paymentMethod: any): string | null => {
  const paymentMethods: { [key: string]: string } = {
    monthly: "شهري",
    quarterly: "ربع سنوي",
    semi_annual: "نصف سنوي",
    annual: "سنوي",
  };
  return paymentMethods[paymentMethod] || null;
};

export const truncateTitle = (title: string, maxLength: number = 40): string => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
};

export const normalizeStatus = (status: any): string => {
  if (status === "1" || status === 1) return "منشور";
  if (status === "0" || status === 0) return "مسودة";
  return status;
};

export function formatAddress(property: any): string {
  // First, check if property has city and district/neighborhood fields directly
  const city = property?.city?.name_ar || property?.city?.name || property?.city_name || property?.city;
  const district = property?.district?.name_ar || property?.district?.name || property?.district_name || property?.district || property?.neighborhood?.name_ar || property?.neighborhood?.name || property?.neighborhood;
  
  // If we have both city and district, return them
  if (district && city) {
    return `${district}، ${city}`;
  } else if (city) {
    return city;
  } else if (district) {
    return district;
  }
  
  // If not available directly, try to parse from address
  const address = property?.address || property?.contents?.[0]?.address;
  if (!address) return "";
  
  // Common Arabic city names
  const cities = [
    "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", 
    "الخبر", "الطائف", "بريدة", "تبوك", "خميس مشيط", "حائل",
    "الجبيل", "نجران", "أبها", "ينبع", "الباحة", "عرعر", "سكاكا"
  ];
  
  // Try to find city in address
  let parsedCity = "";
  let parsedDistrict = "";
  
  // Split by common separators
  const addressParts = address.split(/[،,،\-–—]/).map(p => p.trim()).filter(p => p);
  
  // Find city (usually at the end or contains city name)
  for (let i = addressParts.length - 1; i >= 0; i--) {
    const part = addressParts[i];
    for (const cityName of cities) {
      if (part.includes(cityName)) {
        parsedCity = cityName;
        break;
      }
    }
    if (parsedCity) break;
  }
  
  // District is usually the first part or before city
  if (addressParts.length > 0) {
    const cityIndex = addressParts.findIndex(p => p.includes(parsedCity));
    
    if (cityIndex > 0) {
      // Get the part before city (usually district/neighborhood)
      parsedDistrict = addressParts[cityIndex - 1];
    } else if (addressParts.length > 0 && !parsedCity) {
      // If city not found, use first part as district
      parsedDistrict = addressParts[0];
    }
  }
  
  // Return formatted: district, city or just city if no district
  if (parsedDistrict && parsedCity) {
    return `${parsedDistrict}، ${parsedCity}`;
  } else if (parsedCity) {
    return parsedCity;
  } else if (parsedDistrict) {
    return parsedDistrict;
  }
  
  // Fallback: return original address if parsing fails
  return address;
}

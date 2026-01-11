export interface Pixel {
  id: number;
  platform: string;
  pixel_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PixelFormData {
  platform: string;
  pixel_id: string;
  is_active: boolean;
}

export interface ValidationErrors {
  pixel_id?: string;
  platform?: string;
}

export interface PlatformOption {
  value: string;
  label: string;
}

// Helper functions for platform management
export const getPlatformDisplayName = (platform: string): string => {
  switch (platform) {
    case "facebook":
      return "Facebook";
    case "snapchat":
      return "Snapchat";
    case "tiktok":
      return "TikTok";
    default:
      return platform;
  }
};

export const getPlatformIcon = (platform: string): string => {
  switch (platform) {
    case "facebook":
      return "F";
    case "snapchat":
      return "S";
    case "tiktok":
      return "T";
    default:
      return platform.charAt(0).toUpperCase();
  }
};

export const getPlatformExamples = (platform: string): string => {
  switch (platform) {
    case "facebook":
      return "123456789012345";
    case "snapchat":
      return "SC-4455667788";
    case "tiktok":
      return "ABC123DEF456GHI789JKL";
    default:
      return "";
  }
};

export const getPlatformDescription = (platform: string): string => {
  switch (platform) {
    case "facebook":
      return "Facebook Pixel: معرف مكون من 15 رقم بالضبط. يمكنك العثور عليه في Facebook Events Manager.";
    case "snapchat":
      return "Snapchat Pixel: معرف مخصص من Snapchat. انسخه من إعدادات Snapchat Ads Manager.";
    case "tiktok":
      return "TikTok Pixel: معرف مكون من 20-25 حرف وأرقام كبيرة. يمكنك العثور عليه في TikTok Events Manager.";
    default:
      return "";
  }
};

// Validation function
export const validatePixelForm = (
  data: PixelFormData,
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  // Check required fields
  if (!data.platform || !data.pixel_id) {
    errors.pixel_id = "جميع الحقول مطلوبة";
    return { isValid: false, errors };
  }

  // Platform-specific validation
  if (data.platform === "facebook") {
    if (!/^[0-9]{15}$/.test(data.pixel_id)) {
      errors.pixel_id =
        "Facebook Pixel يجب أن يكون 15 رقم بالضبط (مثال: 123456789012345)";
      return { isValid: false, errors };
    }
  } else if (data.platform === "tiktok") {
    if (!/^[A-Z0-9]{20,25}$/.test(data.pixel_id)) {
      errors.pixel_id =
        "TikTok Pixel يجب أن يكون 20-25 حرف وأرقام كبيرة (مثال: ABC123DEF456GHI789JKL)";
      return { isValid: false, errors };
    }
  } else if (data.platform === "snapchat") {
    if (data.pixel_id.trim().length < 3) {
      errors.pixel_id = "Snapchat Pixel يجب أن يكون 3 أحرف على الأقل";
      return { isValid: false, errors };
    }
  }

  return { isValid: true, errors: {} };
};

// Helper function to get available platforms (excluding already added ones)
export const getAvailablePlatforms = (
  pixels: Pixel[],
  includePlatform?: string,
): PlatformOption[] => {
  const allPlatforms: PlatformOption[] = [
    { value: "facebook", label: "Facebook" },
    { value: "tiktok", label: "TikTok" },
    { value: "snapchat", label: "Snapchat" },
  ];

  const usedPlatforms = new Set(pixels.map((pixel) => pixel.platform));
  if (includePlatform) usedPlatforms.delete(includePlatform);
  return allPlatforms.filter(
    (platform) => !usedPlatforms.has(platform.value),
  );
};

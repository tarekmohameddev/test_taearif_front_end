import { Property } from "../types/types";

export const getCurrentUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return "";
};

export const getShareText = (property: Property | null): string => {
  if (!property) return "";
  return `شاهد هذا العقار الرائع: ${property.title} - ${property.district} - ${property.price} ريال`;
};

export const shareToFacebook = (property: Property | null) => {
  const url = getCurrentUrl();
  const text = getShareText(property);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
  window.open(facebookUrl, "_blank", "width=600,height=400");
};

export const shareToTwitter = (property: Property | null) => {
  const url = getCurrentUrl();
  const text = getShareText(property);
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(twitterUrl, "_blank", "width=600,height=400");
};

export const shareToLinkedIn = (property: Property | null) => {
  const url = getCurrentUrl();
  const text = getShareText(property);
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
  window.open(linkedinUrl, "_blank", "width=600,height=400");
};

export const shareToWhatsApp = (property: Property | null) => {
  const url = getCurrentUrl();
  const text = getShareText(property);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
  window.open(whatsappUrl, "_blank");
};

export const shareToTelegram = (property: Property | null) => {
  const url = getCurrentUrl();
  const text = getShareText(property);
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(telegramUrl, "_blank");
};

export const copyToClipboard = async (): Promise<boolean> => {
  try {
    const url = getCurrentUrl();
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
    return false;
  }
};

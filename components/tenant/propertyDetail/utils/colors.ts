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

export const getLighterColor = (hex: string, opacity: number = 0.2, primaryColor: string = "#059669"): string => {
  if (!hex || !hex.startsWith("#")) return `${primaryColor}33`;
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6) return `${primaryColor}33`;

  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const hexToFilter = (hex: string): string => {
  if (!hex || !hex.startsWith("#")) {
    return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(85%) contrast(94%)";
  }

  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6) {
    return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(85%) contrast(94%)";
  }

  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  const hue = Math.round(h * 360);
  const saturation = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  const brightness = lightness > 50 ? (lightness - 50) * 2 : 0;
  const contrast = 100 + saturation * 0.5;

  return `brightness(0) saturate(100%) invert(${Math.round((1 - lightness / 100) * 100)}%) sepia(${Math.round(saturation)}%) saturate(${Math.round(saturation * 5)}%) hue-rotate(${hue}deg) brightness(${Math.round(100 + brightness)}%) contrast(${Math.round(contrast)}%)`;
};

// ============================================================================
// Constants for LiveEditorUI
// ============================================================================

import type { DeviceType } from "./types";

// Component maps for header and footer
export const headerComponentMap: Record<string, any> = {
  header1: null, // Will be imported dynamically
  header2: null, // Will be imported dynamically
};

export const footerComponentMap: Record<string, any> = {
  footer1: null, // Will be imported dynamically
  footer2: null, // Will be imported dynamically
};

// Device dimensions getter
export const getDeviceDimensions = (t: any) => ({
  phone: { width: 375, height: 667, name: t("live_editor.responsive.mobile") },
  tablet: {
    width: 768,
    height: 1024,
    name: t("live_editor.responsive.tablet"),
  },
  laptop: {
    width: "100%",
    height: "100%",
    name: t("live_editor.responsive.desktop"),
  },
});

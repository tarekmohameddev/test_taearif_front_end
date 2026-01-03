import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// POST /api/tenant/save-pages
// Body: { tenantId: string, pages: Record<string, Array<{ id, type, name, componentName, data, position }>> }
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const {
      tenantId,
      pages,
      globalComponentsData,
      WebsiteLayout,
      ThemesBackup,
    } = req.body || {};

    if (!tenantId || typeof tenantId !== "string") {
      return res.status(400).json({ message: "tenantId is required" });
    }

    if (!pages || typeof pages !== "object") {
      return res
        .status(400)
        .json({ message: "pages is required and must be an object" });
    }

    // Get current tenant data to check for empty pages in database
    const currentTenant = await User.findOne({ username: tenantId });
    if (!currentTenant) {
      return res
        .status(404)
        .json({ message: "Tenant not found (by username)", tenantId });
    }

    // Build a single $set object to write all pages atomically
    const setOps = {};
    let totalComponents = 0;

    // Save global components data
    if (globalComponentsData) {
      setOps.globalComponentsData = globalComponentsData;
    }

    // Save WebsiteLayout data
    if (WebsiteLayout) {
      setOps.WebsiteLayout = WebsiteLayout;
    }

    // Save theme backups dynamically (supports unlimited themes)
    // Regex pattern /^Theme\d+Backup$/ supports any number (1, 2, 10, 11, 100, etc.)
    if (ThemesBackup && typeof ThemesBackup === "object") {
      Object.entries(ThemesBackup).forEach(([backupKey, backupData]) => {
        if (backupKey.match(/^Theme\d+Backup$/)) {
          setOps[backupKey] = backupData;
        }
      });
    }

    for (const [page, components] of Object.entries(pages)) {
      if (!Array.isArray(components)) continue;

      // Skip empty arrays - these pages should be deleted
      if (components.length === 0) continue;

      // Ensure order by position if provided
      const sorted = [...components].sort((a, b) => {
        const pa = typeof a.position === "number" ? a.position : 0;
        const pb = typeof b.position === "number" ? b.position : 0;
        return pa - pb;
      });

      // Store per-component data under componentSettings.<page> keyed by component id
      const settingsForPage = {};
      for (const comp of sorted) {
        if (!comp?.id) continue;
        totalComponents += 1;
        settingsForPage[comp.id] = {
          type: comp.type,
          name: comp.name,
          componentName: comp.componentName,
          data: comp.data,
          position: comp.position,
        };
      }

      // استخدام componentSettings فقط، لا نحتاج componentOrders
      setOps[`componentSettings.${page}`] = settingsForPage;
    }

    // Build $unset object to remove empty pages from database
    const unsetOps = {};
    const currentComponentSettings = currentTenant.componentSettings || {};

    // Check for empty pages in current database that should be deleted
    Object.entries(currentComponentSettings).forEach(([pageName, pageData]) => {
      // If pageData is an empty object or has no components, mark it for deletion
      if (
        !pageData ||
        typeof pageData !== "object" ||
        Object.keys(pageData).length === 0
      ) {
        unsetOps[`componentSettings.${pageName}`] = "";
      }
    });

    // Also check for pages in save request that are empty arrays and mark them for deletion
    Object.entries(pages).forEach(([pageName, components]) => {
      if (Array.isArray(components) && components.length === 0) {
        unsetOps[`componentSettings.${pageName}`] = "";
      }
    });

    // Update existing tenant by username (tenantId corresponds to username)
    const updateOperation = {
      $set: {
        ...setOps,
        updatedAt: new Date(),
      },
    };

    // Add $unset operation if there are empty pages to delete
    if (Object.keys(unsetOps).length > 0) {
      updateOperation.$unset = unsetOps;
    }

    const updated = await User.findOneAndUpdate(
      { username: tenantId },
      updateOperation,
      {
        new: true,
        upsert: false, // Do not create; User has required fields and must exist
      },
    ).select("-password -phoneNumber");

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Tenant not found (by username)", tenantId });
    }

    const pagesDeleted = Object.keys(unsetOps).length;
    const message =
      pagesDeleted > 0
        ? `Pages saved successfully. ${pagesDeleted} empty page(s) deleted from database.`
        : "Pages saved successfully";

    return res.status(200).json({
      success: true,
      message,
      tenantId,
      pagesSaved: Object.keys(pages).length,
      pagesDeleted,
      componentsSaved: totalComponents,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error?.message || String(error),
    });
  }
}

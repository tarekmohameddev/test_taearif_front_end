import dbConnect from "./dbConnect";
import TrackingIntegration from "@/models/TrackingIntegration";

export async function getTenantTrackingIntegrations(tenantId: string) {
  try {
    await dbConnect();

    const integrations = await TrackingIntegration.find({
      tenantId,
      status: "connected",
    }).sort({ createdAt: -1 });

    return {
      success: true,
      data: integrations,
    };
  } catch (error) {
    console.error("Error fetching tracking integrations:", error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch tracking integrations",
    };
  }
}

export async function getTenantTrackingByDomain(domain: string) {
  try {
    await dbConnect();

    // Find tenant by domain (you may need to adjust this based on your domain mapping)
    // For now, we'll use a simple approach - you might need to join with a domains table
    const integrations = await TrackingIntegration.find({
      status: "connected",
    }).populate("tenantId", "websiteName");

    // Filter by domain if needed
    // This is a simplified approach - you might need to implement proper domain resolution
    const filteredIntegrations = integrations.filter((integration) => {
      // Add your domain matching logic here
      return true; // For now, return all
    });

    return {
      success: true,
      data: filteredIntegrations,
    };
  } catch (error) {
    console.error("Error fetching tracking integrations by domain:", error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch tracking integrations",
    };
  }
}

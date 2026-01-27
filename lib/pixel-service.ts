export interface PixelSettings {
    loadOnStorefront: boolean;
    consentMode: boolean;
}

export interface PixelData {
    _id?: string; // Optional - will be generated if not provided
    tenantid?: string; // From API response
    provider: "tiktok" | "meta" | "snapchat" | string;
    externalId: string;
    settings: PixelSettings;
}

interface PixelResponse {
    success: boolean;
    data: PixelData[];
}

// Mock data as requested
const MOCK_PIXELS: PixelResponse = {
    success: true,
    data: [
        {
            _id: "6941fb657ad330a338b0e24e",
            provider: "tiktok",
            externalId: "D50VMLBC77UCC7FFPH9G",
            settings: {
                loadOnStorefront: true,
                consentMode: false,
            },
        },
        {
            _id: "6941d5ff7ad330a338b0e227",
            provider: "meta",
            externalId: "752742154511267",
            settings: {
                loadOnStorefront: true,
                consentMode: false,
            },
        },
        {
            _id: "7041d5ff7ad330a338b0e228",
            provider: "snapchat",
            externalId: "84729103-5162-4821-9382-192837465012", // Example mock ID
            settings: {
                loadOnStorefront: true,
                consentMode: false,
            },
        },
    ],
};

export async function fetchTenantPixels(tenantId: string): Promise<PixelData[]> {
    if (!tenantId) {
        console.warn("fetchTenantPixels: tenantId is required");
        return [];
    }

    try {
        // Get backend URL from environment variable
        const backendUrl = process.env.NEXT_PUBLIC_Backend_URL || "https://api.taearif.com/api";
        
        // Construct the API endpoint
        const apiUrl = `${backendUrl}/v1/tenant-website/${tenantId}/pixels`;
        
        console.log("🔗 Fetching pixels from:", apiUrl);
        
        // Fetch pixels from API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Add cache control to ensure fresh data
            cache: "no-store",
        });

        if (!response.ok) {
            // If 404 or other error, return empty array (no pixels configured)
            if (response.status === 404) {
                console.log("📭 No pixels found for tenant:", tenantId);
                return [];
            }
            
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PixelResponse = await response.json();

        // Validate response structure
        if (!data || typeof data !== "object") {
            throw new Error("Invalid response format");
        }

        // Check if response has success flag and data array
        if (data.success && Array.isArray(data.data)) {
            // Filter pixels based on requirements (loadOnStorefront: true)
            // Also add _id if missing (for React key prop)
            const activePixels = data.data
                .filter((pixel) => pixel.settings?.loadOnStorefront === true)
                .map((pixel) => ({
                    ...pixel,
                    // Generate _id from provider + externalId if not provided
                    _id: pixel._id || `${pixel.provider}-${pixel.externalId}`,
                }));
            
            console.log(`✅ Loaded ${activePixels.length} active pixel(s) for tenant:`, tenantId);
            return activePixels;
        }

        // If response structure is different but has data array directly
        if (Array.isArray(data.data)) {
            const activePixels = data.data
                .filter((pixel) => pixel.settings?.loadOnStorefront === true)
                .map((pixel) => ({
                    ...pixel,
                    // Generate _id from provider + externalId if not provided
                    _id: pixel._id || `${pixel.provider}-${pixel.externalId}`,
                }));
            return activePixels;
        }

        throw new Error("Invalid response format: missing data array");
    } catch (error) {
        console.error("❌ Failed to fetch pixels from API:", error);
        
        // In development, you might want to use mock data as fallback
        // In production, return empty array to avoid showing incorrect pixels
        if (process.env.NODE_ENV === "development") {
            console.warn("⚠️ Using mock data as fallback in development mode");
            const activePixels = MOCK_PIXELS.data.filter(
                (pixel) => pixel.settings.loadOnStorefront
            );
            return activePixels;
        }
        
        // Return empty array in production on error
        return [];
    }
}

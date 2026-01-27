export interface PixelSettings {
    loadOnStorefront: boolean;
    consentMode: boolean;
}

export interface PixelData {
    _id: string;
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
    // In the future, this will be:
    // const res = await fetch(`https://api.example.com/v1/tenant-website/${tenantId}/pixels`);
    // const data = await res.json();
    // return data.data;

    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Filter based on requirements (loadOnStorefront: true)
    const activePixels = MOCK_PIXELS.data.filter(
        (pixel) => pixel.settings.loadOnStorefront
    );

    return activePixels;
}

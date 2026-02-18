import { NextRequest, NextResponse } from "next/server";
import { exportDebugDataForAI } from "@/lib/debug/live-editor/utils/exportForAI";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { componentId, debugData } = body;

    console.log("📥 [Debug Export API] Received request:", {
      hasComponentId: !!componentId,
      hasDebugData: !!debugData,
      eventsCount: debugData?.events?.length || 0,
      tracesCount: debugData?.traces?.length || 0,
      snapshotsCount: debugData?.snapshots?.length || 0,
      dataFlowCount: debugData?.dataFlowHistory?.length || 0,
      performanceCount: debugData?.performanceMetrics?.length || 0,
    });

    // If debugData is provided from client, use it directly
    // Otherwise, try to read from files
    let filePath: string;
    
    if (debugData) {
      // Export data provided from client (in-memory store data)
      console.log("✅ [Debug Export API] Using debugData from client");
      filePath = await exportDebugDataForAI(componentId, debugData);
    } else {
      // Try to read from files
      console.log("⚠️ [Debug Export API] No debugData provided, trying to read from files");
      filePath = await exportDebugDataForAI(componentId);
    }

    return NextResponse.json({
      success: true,
      filePath,
    });
  } catch (error: any) {
    console.error("Error exporting debug data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to export debug data",
      },
      { status: 500 }
    );
  }
}

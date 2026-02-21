import { NextRequest, NextResponse } from "next/server";
import { fileWriter } from "@/lib/debug/live-editor/utils/fileWriter";

export async function POST(request: NextRequest) {
  try {
    await fileWriter.clearAllFiles();

    return NextResponse.json({
      success: true,
      message: "All debug files cleared",
    });
  } catch (error: any) {
    console.error("Error clearing debug files:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to clear debug files",
      },
      { status: 500 }
    );
  }
}

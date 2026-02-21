import { NextRequest, NextResponse } from "next/server";
import { aiQueryInterface } from "@/lib/debug/live-editor/queries/aiQueryInterface";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question is required",
        },
        { status: 400 }
      );
    }

    const result = await aiQueryInterface.query(question);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Error querying AI:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to query AI",
      },
      { status: 500 }
    );
  }
}

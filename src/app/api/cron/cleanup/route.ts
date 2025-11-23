import { NextResponse } from "next/server";
import { cleanupSoftDeletedDocuments } from "~/server/actions/cleanup.actions";

/**
 * Cron job endpoint to permanently clean up soft-deleted documents
 * This endpoint should be called by Vercel Cron every 10 minutes
 *
 * Security: In production, verify the request is coming from Vercel Cron
 * using the Authorization header with CRON_SECRET
 */
export async function GET(request: Request) {
  try {
    // Verify the request is authorized (from Vercel Cron)
    const authHeader = request.headers.get("authorization");

    // In production, verify the cron secret
    if (process.env.NODE_ENV === "production") {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("[Cron] Starting scheduled cleanup job...");

    // Execute cleanup
    const result = await cleanupSoftDeletedDocuments();

    console.log("[Cron] Cleanup job completed:", result);

    return NextResponse.json({
      success: result.success,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error("[Cron] Error in cleanup job:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// Allow POST method as well for manual triggers
export async function POST(request: Request) {
  return GET(request);
}

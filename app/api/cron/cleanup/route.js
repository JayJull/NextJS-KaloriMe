// app/api/cron/cleanup/route.js
import { NextResponse } from "next/server";
import { FoodService } from "@/models/FoodModel";

export async function POST(request) {
  try {
    // Verifikasi cron job (opsional - untuk keamanan)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log("Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting scheduled cleanup at:", new Date().toISOString());

    // Hapus data yang sudah lebih dari 1 hari dari jam 23:00 WIB
    const result = await FoodService.deleteOldRecords();

    console.log("Cleanup completed:", result);

    return NextResponse.json({
      success: true,
      message: "Old records cleaned up successfully",
      result: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cleanup cron error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Cleanup failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Untuk development/testing - manual cleanup
export async function GET() {
  try {
    console.log("Starting manual cleanup at:", new Date().toISOString());

    const result = await FoodService.deleteOldRecords();

    console.log("Manual cleanup completed:", result);

    return NextResponse.json({
      success: true,
      message: "Manual cleanup completed",
      result: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Manual cleanup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Manual cleanup failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

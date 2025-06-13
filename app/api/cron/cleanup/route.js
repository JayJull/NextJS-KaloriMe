// app/api/cron/cleanup/route.js
import { NextResponse } from "next/server";
import { FoodService } from "@/models/FoodModel";
import { supabase } from "@/lib/db";

export async function POST(request) {
  try {
    console.log("=== CRON JOB STARTED ===");
    console.log("Time:", new Date().toISOString());
    console.log("Timezone offset:", new Date().getTimezoneOffset());

    // Verifikasi cron job (opsional untuk keamanan production)
    const authHeader = request.headers.get("authorization");
    const expectedAuth = process.env.CRON_SECRET
      ? `Bearer ${process.env.CRON_SECRET}`
      : null;

    // Skip auth check di development
    if (expectedAuth && authHeader !== expectedAuth) {
      console.log("Unauthorized cron request - Auth header:", authHeader);
      console.log("Expected:", expectedAuth);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting scheduled cleanup...");

    // Hapus data lama
    const result = await FoodService.deleteOldRecords();

    console.log("=== CLEANUP COMPLETED ===");
    console.log("Result:", JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      message: "Old records cleaned up successfully",
      result: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("=== CLEANUP ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);

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

// GET method untuk development/testing - manual cleanup
export async function GET(request) {
  try {
    console.log("=== MANUAL CLEANUP STARTED ===");
    console.log("Time:", new Date().toISOString());

    // Log semua data sebelum cleanup untuk debugging
    const { data: beforeData, error: beforeError } = await supabase
      .from("has_been_eaten")
      .select("id, tanggal")
      .order("tanggal", { ascending: false });

    if (beforeError) {
      console.error("Error fetching data before cleanup:", beforeError);
    } else {
      console.log("Data before cleanup:", beforeData?.length || 0, "records");
      console.log("Sample data:", beforeData?.slice(0, 3));
    }

    const result = await FoodService.deleteOldRecords();

    console.log("=== MANUAL CLEANUP COMPLETED ===");
    console.log("Result:", JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      message: "Manual cleanup completed",
      result: result,
      beforeCount: beforeData?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("=== MANUAL CLEANUP ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);

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

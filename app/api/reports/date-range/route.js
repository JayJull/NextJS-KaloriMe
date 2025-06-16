// app/api/reports/date-range/route.js
import { NextRequest, NextResponse } from "next/server";
import { ReportPresenter } from "@/presenters/ReportPresenter";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");

    const dateRange = ReportPresenter.getDateRangeByDays(days);

    return NextResponse.json({
      success: true,
      data: dateRange,
      message: "Date range calculated successfully",
    });
  } catch (error) {
    console.error("Error calculating date range:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

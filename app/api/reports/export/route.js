// app/api/reports/export/route.js
import { NextRequest, NextResponse } from "next/server";
import { ReportPresenter } from "@/presenters/ReportPresenter";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID, start date, and end date are required",
        },
        { status: 400 }
      );
    }

    const result = await ReportPresenter.getExportData(
      userId,
      startDate,
      endDate
    );

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Error in export API:", error);
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

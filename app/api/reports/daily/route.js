// app/api/reports/daily/route.js
import { NextRequest, NextResponse } from "next/server";
import { ReportPresenter } from "@/presenters/ReportPresenter";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "7");

    if (!userId || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID, start date, and end date are required",
        },
        { status: 400 }
      );
    }

    const result = await ReportPresenter.getDailyConsumption(
      userId,
      startDate,
      endDate
    );

    if (result.success) {
      // Add pagination
      const paginatedResult = ReportPresenter.formatPaginatedData(
        result.data,
        page,
        itemsPerPage
      );

      return NextResponse.json({
        ...result,
        ...paginatedResult,
      });
    }

    return NextResponse.json(result, { status: 500 });
  } catch (error) {
    console.error("Error in daily reports API:", error);
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

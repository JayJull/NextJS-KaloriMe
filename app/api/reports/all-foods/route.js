// app/api/reports/all-foods/route.js
import { NextResponse } from "next/server";
import { ReportPresenter } from "@/presenters/ReportPresenter";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const days = searchParams.get("days") || "7";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "7");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    let result;

    if (startDate && endDate) {
      result = await ReportPresenter.getReportByDateRange(
        userId,
        startDate,
        endDate
      );
    } else {
      result = await ReportPresenter.getReportByDays(userId, parseInt(days));
    }

    if (result.success) {
      // Flatten the data to get all foods
      const allFoods = result.data.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        date_formatted: new Date(item.tanggal).toLocaleDateString("id-ID"),
      }));

      // Apply pagination
      const paginatedResult = ReportPresenter.formatPaginatedData(
        allFoods,
        page,
        itemsPerPage
      );

      return NextResponse.json({
        success: true,
        message: result.message,
        ...paginatedResult,
      });
    }

    return NextResponse.json(result, { status: 500 });
  } catch (error) {
    console.error("Error in all foods API:", error);
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

// app/api/food/upload/route.js
import { NextRequest, NextResponse } from "next/server";
import { FoodPresenter } from "@/presenters/FoodPresenter";
import { FoodService } from "@/models/FoodModel";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const userId = formData.get("userId");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "File harus berupa gambar" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    console.log("Processing upload for user:", userId, "file:", file.name);

    // Process upload dengan presenter
    const result = await FoodPresenter.processUpload(file, userId);

    if (!result.success) {
      return NextResponse.json(result, {
        status: result.showPopup ? 200 : 400,
      });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Upload API error:", error);
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

// GET method untuk mengambil data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");
    const date = searchParams.get("date");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    let data;

    if (type === "today") {
      // Get today's consumption from has_been_eaten
      data = await FoodPresenter.getTodayConsumption(userId);
    } else if (type === "foods") {
      // Get consumption by date for makanan view
      if (date) {
        data = await FoodPresenter.getConsumptionByDate(userId, date);
      } else {
        data = await FoodPresenter.getTodayConsumption(userId);
      }
      data = FoodPresenter.formatFoodData(data);
    } else {
      // Get all has_been_eaten data
      const hasBeenEatenData = await FoodService.getHasBeenEatenByUser(userId);
      data = FoodPresenter.formatReportData(hasBeenEatenData);
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Get data API error:", error);
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

// DELETE method untuk menghapus makanan
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!recordId || !userId) {
      return NextResponse.json(
        { success: false, message: "Record ID and User ID required" },
        { status: 400 }
      );
    }

    const result = await FoodPresenter.deleteHasBeenEaten(recordId, userId);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Delete API error:", error);
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

// app/api/food/upload/route.js
import { NextRequest, NextResponse } from "next/server";
import { FoodPresenter } from "@/presenters/FoodPresenter";
import { FoodService } from "@/models/FoodModel";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const userId = formData.get("userId");
    const uploadType = formData.get("uploadType"); // 'camera' or 'file'
    const timestamp = formData.get("timestamp");

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

    console.log(
      "Processing upload for user:",
      userId,
      "file:",
      file.name,
      "type:",
      uploadType
    );

    // Simpan file ke storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = path.extname(file.name) || ".jpg";
    const fileName = `${userId}_${timestamp || Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}${fileExtension}`;

    // Buat directory jika belum ada
    const uploadDir = path.join(process.cwd(), "public", "uploads", "foods");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.log("Directory already exists or created");
    }

    // Simpan file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Generate URL untuk akses file
    const imageUrl = `/uploads/foods/${fileName}`;

    console.log("File saved successfully:", {
      fileName,
      filePath,
      imageUrl,
      fileSize: file.size,
    });

    // Process upload dengan presenter, berikan imageUrl
    const result = await FoodPresenter.processUpload(file, userId, {
      imageUrl,
      fileName,
      originalName: file.name,
      uploadType,
      fileSize: file.size,
    });

    if (!result.success) {
      return NextResponse.json(result, {
        status: result.showPopup ? 200 : 400,
      });
    }

    // Pastikan imageUrl dikembalikan dalam response
    return NextResponse.json(
      {
        ...result,
        imageUrl, // URL gambar yang disimpan
        fileName,
        uploadedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
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

// GET method untuk mengambil data reports
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // 'reports', 'today', 'foods'

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
      // Get all food reports for makanan view
      const reports = await FoodPresenter.getAllFoodReports(userId);
      data = FoodPresenter.formatFoodData(reports);

      // Pastikan setiap item memiliki imageUrl yang benar
      data = data.map((item) => ({
        ...item,
        foto: item.imageUrl || item.foto || item.image_url,
        // Tambahkan metadata
        source:
          item.source || (item.ai_prediction ? "ai_prediction" : "user_upload"),
        uploadedAt: item.created_at || item.uploadedAt,
      }));

      console.log("Returning food data:", data.length, "items");
    } else {
      // Get all reports
      const reports = await FoodService.getAllReports();
      data = FoodPresenter.formatReportData(
        reports.filter((r) => r.id_users === userId)
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
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
    const reportId = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!reportId || !userId) {
      return NextResponse.json(
        { success: false, message: "Report ID and User ID required" },
        { status: 400 }
      );
    }

    const result = await FoodPresenter.deleteFoodReport(reportId, userId);

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

// app/api/profile/update/route.js
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ProfilePresenter } from "@/presenters/ProfilePresenter";

// GET - Mengambil data profile user yang login
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Silakan login terlebih dahulu",
        },
        { status: 401 }
      );
    }

    const result = await ProfilePresenter.getProfile(
      session.user.email,
      "email"
    );

    const response = ProfilePresenter.formatApiResponse(result);

    if (result.success) {
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json(response, { status: 404 });
    }
  } catch (error) {
    console.error("GET Profile API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server saat mengambil data profile",
        errors: { system: error.message },
      },
      { status: 500 }
    );
  }
}

// POST - Update profile user yang login
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Silakan login terlebih dahulu",
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);

    // Get current user data first
    const currentUser = await ProfilePresenter.getProfile(
      session.user.email,
      "email"
    );

    if (!currentUser.success) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const userId = currentUser.user.id_users;

    // Hitung kalori otomatis dari dailyCalories jika tidak ada kalori yang diberikan
    let calculatedCalories = null;
    if (
      body.berat_badan &&
      body.tinggi_badan &&
      body.umur &&
      body.tingkat_aktivitas
    ) {
      // Hitung BMR (Basal Metabolic Rate) untuk pria
      const bmr =
        88.362 +
        13.397 * parseFloat(body.berat_badan) +
        4.799 * parseFloat(body.tinggi_badan) -
        5.677 * parseInt(body.umur);

      // Activity multipliers
      const activityMultipliers = {
        "tidak pernah": 1.2,
        ringan: 1.375,
        sedang: 1.55,
        aktif: 1.725,
        "sangat aktif": 1.9,
      };

      const multiplier = activityMultipliers[body.tingkat_aktivitas] || 1.2;
      calculatedCalories = Math.round(bmr * multiplier);
    }

    // Tambahkan kalori ke body request
    const updatedBody = {
      ...body,
      kalori: body.kalori || calculatedCalories || null,
    };

    console.log("Updated body with calories:", updatedBody);

    // Update profile using presenter
    const result = await ProfilePresenter.updateProfile(userId, updatedBody);
    console.log("Update result:", result);

    const response = ProfilePresenter.formatApiResponse(result);

    // Log changes untuk audit (opsional)
    if (result.success && result.oldData) {
      const changes = ProfilePresenter.compareProfileChanges(
        result.oldData,
        result.user
      );
      if (changes.hasChanges) {
        console.log(`Profile updated for user ${userId}:`, changes.changes);
      }
    }

    if (result.success) {
      return NextResponse.json(
        {
          ...response,
          message: "Profile berhasil diperbarui!",
        },
        { status: 200 }
      );
    } else {
      console.error("Profile update failed:", result);
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error("POST Profile API Error:", error);
    console.error("Error stack:", error.stack);

    // Handle specific errors
    if (error.message.includes("JSON")) {
      return NextResponse.json(
        {
          success: false,
          message: "Format data tidak valid",
          errors: { body: "Request body harus berupa JSON yang valid" },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server saat memperbarui profile",
        errors: { system: error.message },
      },
      { status: 500 }
    );
  }
}

// PUT - Alternative untuk update (sama seperti POST)
export async function PUT(request) {
  return POST(request);
}

// DELETE - Hapus/reset profile data (opsional)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Silakan login terlebih dahulu",
        },
        { status: 401 }
      );
    }

    // Get user ID
    const currentUser = await ProfilePresenter.getProfile(
      session.user.email,
      "email"
    );

    if (!currentUser.success) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const userId = currentUser.user.id_users;

    // Reset profile data (kecuali nama dan email)
    const resetData = {
      nama: currentUser.user.nama,
      email: currentUser.user.email,
      umur: null,
      berat_badan: null,
      tinggi_badan: null,
      tingkat_aktivitas: "tidak pernah",
    };

    const result = await ProfilePresenter.updateProfile(userId, resetData);
    const response = ProfilePresenter.formatApiResponse(result);

    if (result.success) {
      return NextResponse.json(
        {
          ...response,
          message: "Data profile berhasil direset",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error("DELETE Profile API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server saat mereset profile",
        errors: { system: error.message },
      },
      { status: 500 }
    );
  }
}

// Handle method tidak didukung
export async function PATCH(request) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Method PATCH tidak didukung. Gunakan POST atau PUT untuk update profile",
    },
    { status: 405 }
  );
}

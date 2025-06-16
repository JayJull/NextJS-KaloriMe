import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { FoodService } from "@/models/FoodModel";
import { ProfilePresenter } from "@/presenters/ProfilePresenter";

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

    const userProfile = await ProfilePresenter.getProfile(
      session.user.email,
      "email"
    );

    if (!userProfile.success) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const userId = userProfile.user.id_users;

    // Get date from query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let consumptionData;

    if (date) {
      // Get consumption for specific date
      consumptionData = await FoodService.getHasBeenEatenByDate(userId, date);
    } else {
      // Get today's consumption if no date specified
      consumptionData = await FoodService.getTodayHasBeenEaten(userId);
    }

    // Format the data
    const formattedData = consumptionData.map((item) => ({
      id: item.id,
      nama_makanan: item.nama_makanan,
      kategori: item.kategori,
      kalori: item.kalori,
      foto: item.foto,
      waktu: item.waktu,
      tanggal: item.tanggal,
      waktu_formatted: item.waktu,
      tanggal_formatted: new Date(item.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Data konsumsi berhasil diambil",
        data: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Food Consumption API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server saat mengambil data konsumsi",
        errors: { system: error.message },
      },
      { status: 500 }
    );
  }
}

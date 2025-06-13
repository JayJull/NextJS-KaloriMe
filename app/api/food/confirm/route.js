// api/food/confirm/route.js - API endpoint untuk konfirmasi makanan
import { FoodPresenter } from "@/presenters/FoodPresenter";

export async function POST(request) {
  try {
    const { confirmationData, imageData } = await request.json();

    if (!confirmationData) {
      return Response.json(
        {
          success: false,
          message: "Data konfirmasi tidak ditemukan",
        },
        { status: 400 }
      );
    }

    console.log("Confirming food with data:", {
      foodName: confirmationData.matchedFood?.nama,
      imageData,
      hasImageUrl: !!confirmationData.imageUrl,
    });

    // Panggil fungsi confirmAndSave dari FoodPresenter
    const result = await FoodPresenter.confirmAndSave(
      confirmationData,
      imageData
    );

    if (result.success) {
      return Response.json({
        success: true,
        message: result.message || "Makanan berhasil disimpan!",
        data: result.data,
        imageUrl: result.imageUrl || confirmationData.imageUrl, // Pastikan imageUrl dikembalikan
        savedAt: new Date().toISOString(),
      });
    } else {
      return Response.json(
        {
          success: false,
          message: result.message || "Gagal menyimpan makanan",
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in confirm API:", error);
    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

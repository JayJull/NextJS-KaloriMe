// api/food/confirm/route.js - API endpoint untuk konfirmasi makanan
import { FoodPresenter } from "@/presenters/FoodPresenter";

export async function POST(request) {
  try {
    const { confirmationData } = await request.json();

    if (!confirmationData) {
      return Response.json(
        {
          success: false,
          message: "Data konfirmasi tidak ditemukan",
        },
        { status: 400 }
      );
    }

    // Panggil fungsi confirmAndSave dari FoodPresenter
    const result = await FoodPresenter.confirmAndSave(confirmationData);

    if (result.success) {
      return Response.json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return Response.json(
        {
          success: false,
          message: result.message,
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

// app/api/food/confirm/route.js
import { NextResponse } from "next/server";
import { FoodPresenter } from "@/presenters/FoodPresenter";

export async function POST(request) {
  try {
    const { confirmationData } = await request.json();

    if (!confirmationData) {
      return NextResponse.json(
        { success: false, message: "Confirmation data required" },
        { status: 400 }
      );
    }

    console.log("Processing confirmation:", confirmationData);

    // Process confirmation and save to database
    const result = await FoodPresenter.confirmAndSave(confirmationData);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Confirm API error:", error);
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

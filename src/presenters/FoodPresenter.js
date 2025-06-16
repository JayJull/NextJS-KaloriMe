// presenters/FoodPresenter.js - Fixed version with proper date/time handling
import { makanan } from "@/data/interface";
import { FoodService } from "@/models/FoodModel";
import { Client } from "@gradio/client";

export class FoodPresenter {
  // Helper function untuk mendapatkan waktu WIB yang benar
  static getWIBDateTime() {
    // Buat date object untuk waktu sekarang
    const now = new Date();

    // Konversi ke WIB (UTC+7)
    const wibOffset = 7 * 60; // 7 jam dalam menit
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wibTime = new Date(utc + wibOffset * 60000);

    // Format waktu HH:MM:SS
    const waktu = wibTime.toTimeString().slice(0, 8);

    // Format tanggal YYYY-MM-DD
    const year = wibTime.getFullYear();
    const month = String(wibTime.getMonth() + 1).padStart(2, "0");
    const day = String(wibTime.getDate()).padStart(2, "0");
    const tanggal = `${year}-${month}-${day}`;

    console.log("WIB DateTime:", { waktu, tanggal, fullDate: wibTime });

    return { waktu, tanggal, fullDate: wibTime };
  }

  // Fungsi prediksi gambar menggunakan Gradio Client
  static async predictImage(file) {
    try {
      console.log("Starting image prediction for:", file.name);

      // Connect to Gradio space
      const client = await Client.connect("vinmora2001/Capstone");

      // Make prediction using Gradio client
      const result = await client.predict("/predict", {
        pil_image: file,
      });

      console.log("Gradio prediction result:", result);

      // Extract data from Gradio response
      const predictionData = result.data;

      // Validate response structure - check if data is array and has elements
      if (
        !predictionData ||
        !Array.isArray(predictionData) ||
        predictionData.length === 0 ||
        typeof predictionData[0].predicted_class === "undefined"
      ) {
        throw new Error("Invalid response structure from Gradio API");
      }

      // Access the first element of the array
      const firstPrediction = predictionData[0];

      return {
        success: true,
        predicted_class: firstPrediction.predicted_class,
        confidence: firstPrediction.confidence || null,
      };
    } catch (error) {
      console.error("Error predicting image with Gradio:", error);
      return {
        success: false,
        error: error.message,
        predicted_class: null,
        confidence: null,
      };
    }
  }

  // Ekstrak nama file tanpa ekstensi (digunakan sebagai fallback)
  static extractFileName(fileName) {
    return fileName.split(".")[0].toLowerCase().trim();
  }

  // Validasi makanan berdasarkan predicted_class dari API
  static validateFoodName(predictedClass, fileName = null) {
    console.log("Validating predicted class:", predictedClass);

    if (!predictedClass || predictedClass.trim() === "") {
      console.log("No predicted class provided, trying filename fallback");
      if (fileName) {
        return this.validateFoodNameFromFile(fileName);
      }
      return null;
    }

    // Cari makanan yang cocok berdasarkan predicted_class
    const matchedFood = makanan.find((food) => {
      const foodName = food.nama.toLowerCase().trim();
      const predictedName = predictedClass.toLowerCase().trim();

      // Exact match
      if (foodName === predictedName) {
        console.log("Exact match found:", food.nama);
        return true;
      }

      // Contains match (bidirectional)
      if (
        foodName.includes(predictedName) ||
        predictedName.includes(foodName)
      ) {
        console.log("Contains match found:", food.nama);
        return true;
      }

      // Remove spaces and check
      const foodNameNoSpace = foodName.replace(/\s+/g, "");
      const predictedNameNoSpace = predictedName.replace(/\s+/g, "");

      if (
        foodNameNoSpace.includes(predictedNameNoSpace) ||
        predictedNameNoSpace.includes(foodNameNoSpace)
      ) {
        console.log("No-space match found:", food.nama);
        return true;
      }

      // Check untuk kata kunci yang sama (minimum 3 karakter)
      if (predictedNameNoSpace.length >= 3 && foodNameNoSpace.length >= 3) {
        if (
          foodNameNoSpace.startsWith(predictedNameNoSpace.slice(0, 3)) ||
          predictedNameNoSpace.startsWith(foodNameNoSpace.slice(0, 3))
        ) {
          console.log("Partial match found:", food.nama);
          return true;
        }
      }

      return false;
    });

    console.log("Matched food from prediction:", matchedFood);

    // Jika tidak ada match dari predicted_class, coba fallback ke filename
    if (!matchedFood && fileName) {
      console.log(
        "No match from prediction, trying filename fallback:",
        fileName
      );
      return this.validateFoodNameFromFile(fileName);
    }

    return matchedFood;
  }

  // Fungsi fallback untuk validasi berdasarkan nama file
  static validateFoodNameFromFile(fileName) {
    const cleanFileName = this.extractFileName(fileName);
    console.log("Validating file name as fallback:", cleanFileName);

    const matchedFood = makanan.find((food) => {
      const foodName = food.nama.toLowerCase().trim();

      // Exact match
      if (foodName === cleanFileName) return true;

      // Contains match
      if (foodName.includes(cleanFileName) || cleanFileName.includes(foodName))
        return true;

      // Remove spaces and check
      const foodNameNoSpace = foodName.replace(/\s+/g, "");
      const cleanFileNameNoSpace = cleanFileName.replace(/\s+/g, "");

      if (
        foodNameNoSpace.includes(cleanFileNameNoSpace) ||
        cleanFileNameNoSpace.includes(foodNameNoSpace)
      )
        return true;

      // Check first few characters
      if (
        cleanFileNameNoSpace.length >= 3 &&
        foodNameNoSpace.startsWith(cleanFileNameNoSpace.slice(0, 3))
      )
        return true;

      return false;
    });

    console.log("Matched food from filename:", matchedFood);
    return matchedFood;
  }

  // Check if date is today
  static isToday(date) {
    const { tanggal: todayWIB } = this.getWIBDateTime();
    const checkDate =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    return checkDate === todayWIB;
  }

  // Proses upload dengan Gradio API prediksi - TANPA langsung save ke database
  static async processUpload(file, userId) {
    try {
      const fileName = file.name;
      console.log("Processing upload for file:", fileName);

      // Langkah 1: Prediksi gambar menggunakan Gradio Client
      console.log("Step 1: Predicting image using Gradio Client...");
      const predictionResult = await this.predictImage(file);

      let matchedFood = null;
      let predictionInfo = {
        api_used: "gradio_client",
        space: "vinmora2001/Capstone",
        endpoint: "/predict",
        timestamp: new Date().toISOString(),
      };

      if (predictionResult.success && predictionResult.predicted_class) {
        // Jika prediksi berhasil, gunakan predicted_class
        predictionInfo = {
          ...predictionInfo,
          predicted_class: predictionResult.predicted_class,
          confidence: predictionResult.confidence,
          method: "gradio_prediction",
          success: true,
        };

        console.log(
          "Using Gradio prediction:",
          predictionResult.predicted_class
        );
        matchedFood = this.validateFoodName(
          predictionResult.predicted_class,
          fileName
        );
      } else {
        // Jika prediksi gagal, fallback ke nama file
        console.log("Gradio prediction failed, using filename fallback");
        predictionInfo = {
          ...predictionInfo,
          predicted_class: null,
          confidence: null,
          method: "filename_fallback",
          success: false,
          error: predictionResult.error || "Unknown Gradio API error",
        };

        matchedFood = this.validateFoodNameFromFile(fileName);
      }

      if (!matchedFood) {
        console.log("No matching food found");
        const errorMessage =
          predictionResult.success && predictionResult.predicted_class
            ? `Makanan "${predictionResult.predicted_class}" tidak ditemukan dalam database`
            : predictionResult.error
            ? `Gagal memprediksi makanan: ${predictionResult.error}`
            : "Makanan tidak ditemukan dalam database";

        return {
          success: false,
          message: errorMessage,
          showPopup: true,
          popupType: "not_found",
          predictionInfo: predictionInfo,
        };
      }

      console.log("Matched food:", matchedFood.nama);

      // FIXED: Store file as base64 string instead of object
      const fileBase64 = await this.fileToBase64(file);

      // PENTING: Jangan langsung save ke database, tapi return data untuk konfirmasi
      return {
        success: true,
        requiresConfirmation: true,
        showPopup: true,
        popupType: "confirmation",
        message: "Makanan berhasil dideteksi",
        data: {
          matchedFood: matchedFood,
          fileBase64: fileBase64, // Store as base64 string
          fileName: fileName,
          fileType: file.type,
          fileSize: file.size,
          userId: userId,
        },
        predictionInfo: predictionInfo,
      };
    } catch (error) {
      console.error("Error processing upload:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat upload",
        error: error.message,
        showPopup: true,
        popupType: "error",
        predictionInfo: {
          success: false,
          error: error.message,
          method: "error",
        },
      };
    }
  }

  // Helper function to convert file to base64
  static async fileToBase64(file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  // Helper function to convert base64 back to file
  static base64ToFile(base64String, fileName, fileType) {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: fileType || mime });
  }

  // Fungsi baru untuk konfirmasi dan save ke database - FIXED DATE/TIME
  static async confirmAndSave(data) {
    try {
      const { matchedFood, fileBase64, fileName, fileType, userId } = data;

      console.log("Confirming and saving to database...");

      // Convert base64 back to file object
      const file = this.base64ToFile(fileBase64, fileName, fileType);

      // Langkah 1: Upload gambar ke Supabase Storage
      console.log("Step 1: Uploading image to storage...");
      const imageUrl = await FoodService.uploadImage(file, fileName);
      console.log("Image uploaded to:", imageUrl);

      // Langkah 2: Simpan ke database
      console.log("Step 2: Saving to database...");

      // FIXED: Gunakan fungsi getWIBDateTime() untuk waktu yang benar
      const { waktu, tanggal } = this.getWIBDateTime();

      console.log("Using WIB time:", { waktu, tanggal });

      // Prepare data untuk has_been_eaten
      const hasBeenEatenData = {
        nama_makanan: matchedFood.nama,
        kategori: matchedFood.kategori,
        kalori: matchedFood.kalori,
        foto: imageUrl,
        waktu: waktu,
        tanggal: tanggal,
        id_users: userId,
      };

      // Insert ke has_been_eaten table
      console.log("Inserting to has_been_eaten table:", hasBeenEatenData);
      const hasBeenEatenResult = await FoodService.createHasBeenEaten(
        hasBeenEatenData
      );

      return {
        success: true,
        message: `Berhasil menambahkan ${matchedFood.nama} (${matchedFood.kalori} kalori)`,
        data: {
          hasBeenEaten: hasBeenEatenResult,
          matchedFood: matchedFood,
        },
      };
    } catch (error) {
      console.error("Error confirming and saving:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat menyimpan data",
        error: error.message,
      };
    }
  }

  // Format data untuk tampilan
  static formatReportData(reports) {
    return reports.map((report) => ({
      ...report,
      waktu_formatted: report.waktu,
      tanggal_formatted: new Date(report.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
  }

  // Get user's today consumption - FIXED untuk menggunakan tanggal WIB
  static async getTodayConsumption(userId) {
    try {
      const data = await FoodService.getTodayHasBeenEaten(userId);
      return this.formatReportData(data);
    } catch (error) {
      console.error("Error fetching today consumption:", error);
      throw error;
    }
  }

  // Get user's consumption by date
  static async getConsumptionByDate(userId, date) {
    try {
      const data = await FoodService.getHasBeenEatenByDate(userId, date);
      return this.formatReportData(data);
    } catch (error) {
      console.error("Error fetching consumption by date:", error);
      throw error;
    }
  }

  // Format food data untuk display di makanan view
  static formatFoodData(reports) {
    return reports.map((report) => ({
      id: report.id,
      nama: report.nama_makanan || "Unknown Food",
      kategori: report.kategori || "Lainnya",
      kalori: report.kalori || 0,
      foto:
        report.foto ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center",
      waktu: report.waktu,
      tanggal: report.tanggal,
      tanggal_formatted: new Date(report.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
  }

  // Delete has_been_eaten record
  static async deleteHasBeenEaten(recordId, userId) {
    try {
      const result = await FoodService.deleteHasBeenEaten(recordId, userId);
      return {
        success: true,
        message: "Makanan berhasil dihapus",
        data: result,
      };
    } catch (error) {
      console.error("Error deleting has_been_eaten record:", error);
      return {
        success: false,
        message: "Gagal menghapus makanan",
        error: error.message,
      };
    }
  }
}

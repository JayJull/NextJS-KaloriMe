// presenters/FoodPresenter.js - Updated with fixed image upload logic
import { makanan } from "@/data/interface";
import { FoodService } from "@/models/FoodModel";
import { Client } from "@gradio/client";

export class FoodPresenter {
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

    // Cari makanan yang cocok berdasarkan predicted_class - EXACT MATCH ONLY
    const matchedFood = makanan.find((food) => {
      const foodName = food.nama.toLowerCase().trim();
      const predictedName = predictedClass.toLowerCase().trim();

      // HANYA exact match
      if (foodName === predictedName) {
        console.log("Exact match found:", food.nama);
        return true;
      }

      // OPSIONAL: Exact match tanpa spasi (untuk handle "Nasi Goreng" vs "NasiGoreng")
      const foodNameNoSpace = foodName.replace(/\s+/g, "");
      const predictedNameNoSpace = predictedName.replace(/\s+/g, "");

      if (foodNameNoSpace === predictedNameNoSpace) {
        console.log("Exact no-space match found:", food.nama);
        return true;
      }

      return false;
    });

    console.log("Matched food from prediction:", matchedFood);

    // Jika tidak ada exact match dari predicted_class, coba fallback ke filename
    if (!matchedFood && fileName) {
      console.log(
        "No exact match from prediction, trying filename fallback:",
        fileName
      );
      return this.validateFoodNameFromFile(fileName);
    }

    return matchedFood;
  }

  // Fungsi fallback untuk validasi berdasarkan nama file - EXACT MATCH ONLY
  static validateFoodNameFromFile(fileName) {
    const cleanFileName = this.extractFileName(fileName);
    console.log("Validating file name as fallback:", cleanFileName);

    const matchedFood = makanan.find((food) => {
      const foodName = food.nama.toLowerCase().trim();

      // HANYA exact match
      if (foodName === cleanFileName) {
        console.log("Exact match from filename:", food.nama);
        return true;
      }

      // OPSIONAL: Exact match tanpa spasi
      const foodNameNoSpace = foodName.replace(/\s+/g, "");
      const cleanFileNameNoSpace = cleanFileName.replace(/\s+/g, "");

      if (foodNameNoSpace === cleanFileNameNoSpace) {
        console.log("Exact no-space match from filename:", food.nama);
        return true;
      }

      return false;
    });

    console.log("Matched food from filename:", matchedFood);
    return matchedFood;
  }

  // Convert File object to format suitable for storage
  static async prepareFileForStorage(file) {
    try {
      // Generate unique filename to prevent conflicts
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split(".").pop();
      const uniqueFileName = `food_${timestamp}_${randomStr}.${extension}`;

      console.log("Original filename:", file.name);
      console.log("Generated unique filename:", uniqueFileName);

      return {
        file: file,
        originalName: file.name,
        uniqueName: uniqueFileName,
      };
    } catch (error) {
      console.error("Error preparing file for storage:", error);
      throw error;
    }
  }

  // Proses upload dengan Gradio API prediksi - TANPA langsung save ke database
  static async processUpload(file, userId) {
    try {
      const fileName = file.name;
      console.log("Processing upload for file:", fileName);

      // Prepare file for storage
      const fileData = await this.prepareFileForStorage(file);

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

      // PENTING: Return data untuk konfirmasi, termasuk prepared file data
      return {
        success: true,
        requiresConfirmation: true,
        showPopup: true,
        popupType: "confirmation",
        message: "Makanan berhasil dideteksi",
        data: {
          matchedFood: matchedFood, // Data dari interface (nama, kategori, kalori)
          fileData: fileData, // Data file yang sudah dipersiapkan untuk upload
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

  // Fungsi baru untuk konfirmasi dan save ke database
  static async confirmAndSave(data) {
    try {
      const { matchedFood, fileData, userId } = data;

      console.log("Confirming and saving to database...");
      console.log("Matched food from interface:", matchedFood);
      console.log("File data from user upload:", fileData);

      // Langkah 1: Upload gambar DARI USER ke Supabase Storage
      console.log("Step 1: Uploading USER IMAGE to storage...");
      console.log("Using user's original file:", fileData.file.name);

      // PASTIKAN: Gunakan file.file (foto asli dari user), BUKAN foto dari interface
      const imageUrl = await FoodService.uploadImage(
        fileData.file, // INI ADALAH FOTO DARI USER
        fileData.uniqueName
      );
      console.log("User image uploaded to:", imageUrl);

      // Langkah 2: Simpan ke database dengan DATA DARI INTERFACE + FOTO DARI USER
      console.log("Step 2: Saving to database...");
      console.log("Using food data from interface:", {
        nama: matchedFood.nama,
        kategori: matchedFood.kategori,
        kalori: matchedFood.kalori,
      });
      console.log(
        "Using photo from user upload (NOT from interface):",
        imageUrl
      );

      // Get current time in WIB (UTC + 7)
      const now = new Date();
      const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      const waktu = wibTime.toTimeString().slice(0, 8); // HH:MM:SS format
      const tanggal = wibTime.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Prepare data untuk report - FOTO DARI USER, DATA DARI INTERFACE
      const reportData = {
        nama_makanan: matchedFood.nama, // Dari interface
        kategori: matchedFood.kategori, // Dari interface
        kalori: matchedFood.kalori, // Dari interface
        foto: imageUrl, // FOTO DARI USER UPLOAD (bukan dari interface)
        waktu: waktu,
        tanggal: tanggal,
        id_users: userId,
      };

      // Prepare data untuk has_been_eaten - FOTO DARI USER, DATA DARI INTERFACE
      const hasBeenEatenData = {
        nama_makanan: matchedFood.nama, // Dari interface
        kategori: matchedFood.kategori, // Dari interface
        kalori: matchedFood.kalori, // Dari interface
        foto: imageUrl, // FOTO DARI USER UPLOAD (bukan dari interface)
        waktu: waktu,
        tanggal: tanggal,
        id_users: userId,
      };

      // Insert ke kedua table
      console.log("Inserting to report table:", reportData);
      const reportResult = await FoodService.createReport(reportData);

      console.log("Inserting to has_been_eaten table:", hasBeenEatenData);
      const hasBeenEatenResult = await FoodService.createHasBeenEaten(
        hasBeenEatenData
      );

      return {
        success: true,
        message: `Berhasil menambahkan ${matchedFood.nama} (${matchedFood.kalori} kalori)`,
        data: {
          report: reportResult,
          hasBeenEaten: hasBeenEatenResult,
          matchedFood: matchedFood,
          uploadedImageUrl: imageUrl, // URL foto yang diupload user
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

  // Get user's today consumption
  static async getTodayConsumption(userId) {
    try {
      const data = await FoodService.getTodayHasBeenEaten(userId);
      return this.formatReportData(data);
    } catch (error) {
      console.error("Error fetching today consumption:", error);
      throw error;
    }
  }

  // Get all food reports for makanan view
  static async getAllFoodReports(userId = null) {
    try {
      const reports = await FoodService.getAllFoodReports(userId);
      return this.formatReportData(reports);
    } catch (error) {
      console.error("Error fetching food reports:", error);
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
      foto: report.foto, // HARUS foto dari upload user, TIDAK ada fallback ke default image
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

  // Delete food report
  static async deleteFoodReport(reportId, userId) {
    try {
      const result = await FoodService.deleteFoodReport(reportId, userId);
      return {
        success: true,
        message: "Makanan berhasil dihapus",
        data: result,
      };
    } catch (error) {
      console.error("Error deleting food report:", error);
      return {
        success: false,
        message: "Gagal menghapus makanan",
        error: error.message,
      };
    }
  }
}

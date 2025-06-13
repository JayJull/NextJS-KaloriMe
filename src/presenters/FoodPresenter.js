// presenters/FoodPresenter.js
import { makanan } from "@/data/interface";
import { FoodService } from "@/models/FoodModel";

export class FoodPresenter {
  // Ekstrak nama file tanpa ekstensi
  static extractFileName(fileName) {
    return fileName.split(".")[0].toLowerCase().trim();
  }

  // Validasi nama file dengan data interface
  static validateFoodName(fileName) {
    const cleanFileName = this.extractFileName(fileName);
    console.log("Validating file name:", cleanFileName);

    // Cari makanan yang cocok berdasarkan nama
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

      // Check first 5 characters
      if (
        foodNameNoSpace.slice(0, 5) === cleanFileNameNoSpace.slice(0, 5) &&
        cleanFileNameNoSpace.length >= 3
      )
        return true;

      return false;
    });

    console.log("Matched food:", matchedFood);
    return matchedFood;
  }

  // Proses upload dan validasi
  static async processUpload(file, userId) {
    try {
      const fileName = file.name;
      console.log("Processing upload for file:", fileName);

      const matchedFood = this.validateFoodName(fileName);

      if (!matchedFood) {
        console.log("No matching food found for:", fileName);
        return {
          success: false,
          message: "Makanan tidak ditemukan dalam database",
          showPopup: true,
        };
      }

      // Upload gambar ke Supabase Storage
      const imageUrl = await FoodService.uploadImage(file, fileName);
      console.log("Image uploaded to:", imageUrl);

      // Get current time in WIB (UTC + 7)
      const now = new Date();
      const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      const waktu = wibTime.toTimeString().slice(0, 8); // HH:MM:SS format
      const tanggal = wibTime.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Prepare data untuk report
      const reportData = {
        nama_makanan: matchedFood.nama,
        kategori: matchedFood.kategori,
        kalori: matchedFood.kalori,
        foto: imageUrl,
        waktu: waktu,
        tanggal: tanggal,
        id_users: userId,
      };

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
        },
      };
    } catch (error) {
      console.error("Error processing upload:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat upload",
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

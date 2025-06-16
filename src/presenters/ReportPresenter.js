// presenters/ReportPresenter.js
import { ReportService } from "@/models/ReportModel";

export class ReportPresenter {
  // Format report data for display
  static formatReportData(reports) {
    return reports.map((report) => ({
      id: report.id,
      nama_makanan: report.nama_makanan || "Unknown Food",
      kategori: report.kategori || "Lainnya",
      kalori: report.kalori || 0,
      foto:
        report.foto ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&crop=center",
      waktu: report.waktu,
      tanggal: report.tanggal,
      waktu_formatted: report.waktu,
      tanggal_formatted: new Date(report.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
  }

  // Get report by date range
  static async getReportByDateRange(userId, startDate, endDate) {
    try {
      const data = await ReportService.getReportByDateRange(
        userId,
        startDate,
        endDate
      );
      return {
        success: true,
        data: this.formatReportData(data),
        message: "Data laporan berhasil diambil",
      };
    } catch (error) {
      console.error("Error getting report by date range:", error);
      return {
        success: false,
        message: "Gagal mengambil data laporan",
        error: error.message,
        data: [],
      };
    }
  }

  // Get report by days (7, 14, 30 days)
  static async getReportByDays(userId, days) {
    try {
      const data = await ReportService.getReportByDays(userId, days);
      return {
        success: true,
        data: this.formatReportData(data),
        message: `Data laporan ${days} hari terakhir berhasil diambil`,
      };
    } catch (error) {
      console.error("Error getting report by days:", error);
      return {
        success: false,
        message: `Gagal mengambil data laporan ${days} hari terakhir`,
        error: error.message,
        data: [],
      };
    }
  }

  // Get monthly report with calendar format
  static async getMonthlyReport(userId, year, month) {
    try {
      const data = await ReportService.getCalendarData(userId, year, month);
      return {
        success: true,
        data: data,
        message: "Data laporan bulanan berhasil diambil",
      };
    } catch (error) {
      console.error("Error getting monthly report:", error);
      return {
        success: false,
        message: "Gagal mengambil data laporan bulanan",
        error: error.message,
        data: {},
      };
    }
  }

  // Get consumption summary
  static async getConsumptionSummary(userId, days = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const endDateStr = endDate.toISOString().split("T")[0];
      const startDateStr = startDate.toISOString().split("T")[0];

      const summaryData = await ReportService.getConsumptionSummary(
        userId,
        startDateStr,
        endDateStr
      );

      return {
        success: true,
        data: {
          ...summaryData,
          period: `${days} hari terakhir`,
          formattedTotalCalories: summaryData.totalCalories.toLocaleString(),
          formattedAverageCalories:
            summaryData.averageCaloriesPerDay.toLocaleString(),
        },
        message: "Data ringkasan konsumsi berhasil diambil",
      };
    } catch (error) {
      console.error("Error getting consumption summary:", error);
      return {
        success: false,
        message: "Gagal mengambil data ringkasan konsumsi",
        error: error.message,
        data: null,
      };
    }
  }

  // Get daily consumption data
  static async getDailyConsumption(userId, startDate, endDate) {
    try {
      const data = await ReportService.getDailyConsumption(
        userId,
        startDate,
        endDate
      );

      // Format the data for display
      const formattedData = data.map((dayData) => ({
        ...dayData,
        foods: this.formatReportData(dayData.foods),
        date_formatted: new Date(dayData.date).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        totalCalories_formatted: dayData.totalCalories.toLocaleString(),
      }));

      return {
        success: true,
        data: formattedData,
        message: "Data konsumsi harian berhasil diambil",
      };
    } catch (error) {
      console.error("Error getting daily consumption:", error);
      return {
        success: false,
        message: "Gagal mengambil data konsumsi harian",
        error: error.message,
        data: [],
      };
    }
  }

  // Get category statistics
  static async getCategoryStats(userId, days = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const endDateStr = endDate.toISOString().split("T")[0];
      const startDateStr = startDate.toISOString().split("T")[0];

      const categoryStats = await ReportService.getCategoryStats(
        userId,
        startDateStr,
        endDateStr
      );

      // Calculate percentages
      const totalCalories = categoryStats.reduce(
        (sum, cat) => sum + cat.totalCalories,
        0
      );

      const formattedStats = categoryStats.map((stat) => ({
        ...stat,
        percentage:
          totalCalories > 0
            ? Math.round((stat.totalCalories / totalCalories) * 100)
            : 0,
        totalCalories_formatted: stat.totalCalories.toLocaleString(),
        averageCalories: Math.round(stat.totalCalories / stat.count),
      }));

      return {
        success: true,
        data: formattedStats,
        message: "Data statistik kategori berhasil diambil",
      };
    } catch (error) {
      console.error("Error getting category stats:", error);
      return {
        success: false,
        message: "Gagal mengambil data statistik kategori",
        error: error.message,
        data: [],
      };
    }
  }

  // Get export data for PDF
  static async getExportData(userId, startDate, endDate) {
    try {
      const exportData = await ReportService.getExportData(
        userId,
        startDate,
        endDate
      );

      return {
        success: true,
        data: {
          ...exportData,
          reportData: this.formatReportData(exportData.reportData),
          summary: {
            ...exportData.summary,
            formattedTotalCalories:
              exportData.summary.totalCalories.toLocaleString(),
            formattedAverageCalories:
              exportData.summary.averageCaloriesPerDay.toLocaleString(),
          },
          categoryStats: exportData.categoryStats.map((stat) => ({
            ...stat,
            totalCalories_formatted: stat.totalCalories.toLocaleString(),
          })),
        },
        message: "Data export berhasil diambil",
      };
    } catch (error) {
      console.error("Error getting export data:", error);
      return {
        success: false,
        message: "Gagal mengambil data export",
        error: error.message,
        data: null,
      };
    }
  }

  // Helper function to get calorie status
  static getCalorieStatus(totalCalories) {
    if (totalCalories > 2000) {
      return {
        status: "Tinggi",
        color: "text-red-600 bg-red-50",
        description: "Konsumsi kalori melebihi rekomendasi harian",
      };
    }
    if (totalCalories > 1500) {
      return {
        status: "Normal",
        color: "text-green-600 bg-green-50",
        description: "Konsumsi kalori dalam rentang normal",
      };
    }
    return {
      status: "Rendah",
      color: "text-yellow-600 bg-yellow-50",
      description: "Konsumsi kalori di bawah rekomendasi harian",
    };
  }

  // Format data for paginated display
  static formatPaginatedData(data, page = 1, itemsPerPage = 10) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        itemsPerPage: itemsPerPage,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / itemsPerPage),
        hasNextPage: page < Math.ceil(data.length / itemsPerPage),
        hasPrevPage: page > 1,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, data.length),
      },
    };
  }

  // Calculate date range helpers
  static getDateRangeByDays(days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      startDate_formatted: startDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      endDate_formatted: endDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }

  // Format time display
  static formatTime(timeString) {
    if (!timeString) return "";
    return timeString.slice(0, 5); // HH:MM format
  }

  // Check if date is today
  static isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  }

  // Check if date is this week
  static isThisWeek(date) {
    const today = new Date();
    const checkDate = new Date(date);
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    return checkDate >= startOfWeek && checkDate <= endOfWeek;
  }
}

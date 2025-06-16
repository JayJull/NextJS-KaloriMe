// models/ReportModel.js
import { supabase } from "@/lib/db";

export class ReportService {
  // Get report data by date range
  static async getReportByDateRange(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from("has_been_eaten")
        .select("*")
        .eq("id_users", userId)
        .gte("tanggal", startDate)
        .lte("tanggal", endDate)
        .order("tanggal", { ascending: false })
        .order("waktu", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching report by date range:", error);
      throw error;
    }
  }

  // Get report data for last N days
  static async getReportByDays(userId, days) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const endDateStr = endDate.toISOString().split("T")[0];
      const startDateStr = startDate.toISOString().split("T")[0];

      return await this.getReportByDateRange(userId, startDateStr, endDateStr);
    } catch (error) {
      console.error("Error fetching report by days:", error);
      throw error;
    }
  }

  // Get monthly report data
  static async getMonthlyReport(userId, year, month) {
    try {
      // Month is 0-indexed in JavaScript Date, but we want 1-indexed input
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("has_been_eaten")
        .select("*")
        .eq("id_users", userId)
        .gte("tanggal", startDateStr)
        .lte("tanggal", endDateStr)
        .order("tanggal", { ascending: true })
        .order("waktu", { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching monthly report:", error);
      throw error;
    }
  }

  // Get consumption summary statistics
  static async getConsumptionSummary(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from("has_been_eaten")
        .select("kalori, tanggal")
        .eq("id_users", userId)
        .gte("tanggal", startDate)
        .lte("tanggal", endDate);

      if (error) throw error;

      // Calculate statistics
      const totalCalories = data.reduce(
        (sum, item) => sum + (item.kalori || 0),
        0
      );
      const totalItems = data.length;

      // Get unique dates
      const uniqueDates = [...new Set(data.map((item) => item.tanggal))];
      const totalDays = uniqueDates.length;

      const averageCaloriesPerDay =
        totalDays > 0 ? Math.round(totalCalories / totalDays) : 0;

      return {
        totalCalories,
        totalItems,
        totalDays,
        averageCaloriesPerDay,
        dateRange: {
          startDate,
          endDate,
        },
      };
    } catch (error) {
      console.error("Error fetching consumption summary:", error);
      throw error;
    }
  }

  // Get daily consumption grouped by date
  static async getDailyConsumption(userId, startDate, endDate) {
    try {
      const data = await this.getReportByDateRange(userId, startDate, endDate);

      // Group by date
      const groupedData = data.reduce((acc, item) => {
        const date = item.tanggal;
        if (!acc[date]) {
          acc[date] = {
            date: date,
            foods: [],
            totalCalories: 0,
            totalItems: 0,
          };
        }

        acc[date].foods.push(item);
        acc[date].totalCalories += item.kalori || 0;
        acc[date].totalItems += 1;

        return acc;
      }, {});

      // Convert to array and sort by date
      return Object.values(groupedData).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } catch (error) {
      console.error("Error fetching daily consumption:", error);
      throw error;
    }
  }

  // Get category consumption statistics
  static async getCategoryStats(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from("has_been_eaten")
        .select("kategori, kalori")
        .eq("id_users", userId)
        .gte("tanggal", startDate)
        .lte("tanggal", endDate);

      if (error) throw error;

      // Group by category
      const categoryStats = data.reduce((acc, item) => {
        const category = item.kategori || "Lainnya";
        if (!acc[category]) {
          acc[category] = {
            category: category,
            totalCalories: 0,
            count: 0,
          };
        }

        acc[category].totalCalories += item.kalori || 0;
        acc[category].count += 1;

        return acc;
      }, {});

      return Object.values(categoryStats).sort(
        (a, b) => b.totalCalories - a.totalCalories
      );
    } catch (error) {
      console.error("Error fetching category stats:", error);
      throw error;
    }
  }

  // Get consumption data for calendar view
  static async getCalendarData(userId, year, month) {
    try {
      const data = await this.getMonthlyReport(userId, year, month);

      // Group by date for calendar display
      const calendarData = data.reduce((acc, item) => {
        const date = item.tanggal;
        if (!acc[date]) {
          acc[date] = {
            date: date,
            foods: [],
            totalCalories: 0,
            categories: new Set(),
          };
        }

        acc[date].foods.push({
          id: item.id,
          name: item.nama_makanan,
          category: item.kategori,
          calories: item.kalori,
          image: item.foto,
          time: item.waktu,
        });

        acc[date].totalCalories += item.kalori || 0;
        acc[date].categories.add(item.kategori);

        return acc;
      }, {});

      // Convert Set to Array for categories
      Object.values(calendarData).forEach((dayData) => {
        dayData.categories = Array.from(dayData.categories);
      });

      return calendarData;
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      throw error;
    }
  }

  // Export report data (for PDF generation)
  static async getExportData(userId, startDate, endDate) {
    try {
      const [reportData, summaryData, categoryStats] = await Promise.all([
        this.getReportByDateRange(userId, startDate, endDate),
        this.getConsumptionSummary(userId, startDate, endDate),
        this.getCategoryStats(userId, startDate, endDate),
      ]);

      return {
        reportData,
        summary: summaryData,
        categoryStats,
        exportDate: new Date().toISOString(),
        dateRange: {
          startDate,
          endDate,
        },
      };
    } catch (error) {
      console.error("Error fetching export data:", error);
      throw error;
    }
  }
}

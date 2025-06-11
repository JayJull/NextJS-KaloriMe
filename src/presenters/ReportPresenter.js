// src/presenters/ReportPresenter.js

import { ReportModel } from "@/models/Report";

export class ReportPresenter {
  constructor() {
    this.reportModel = new ReportModel();
  }

  async createReport(reportData) {
    try {
      const validation = this.validateReportInput(reportData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.message,
        };
      }

      const existingReports = await this.reportModel.findByMakananId(
        reportData.id_makanan
      );
      const report = await this.reportModel.create(reportData);

      return {
        success: true,
        data: report,
        message: `Laporan berhasil dibuat. Total laporan untuk makanan ini: ${
          existingReports.length + 1
        }`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getReportById(id_report) {
    try {
      if (!id_report || id_report <= 0) {
        return {
          success: false,
          error: "ID report tidak valid",
        };
      }

      const report = await this.reportModel.findById(id_report);

      if (!report) {
        return {
          success: false,
          error: "Report tidak ditemukan",
        };
      }

      return {
        success: true,
        data: report,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getReportsByMakananId(id_makanan) {
    try {
      if (!id_makanan || id_makanan <= 0) {
        return {
          success: false,
          error: "ID makanan tidak valid",
        };
      }

      const reports = await this.reportModel.findByMakananId(id_makanan);

      return {
        success: true,
        data: reports,
        message: `Ditemukan ${reports.length} laporan untuk makanan ini`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getAllReports(page = 1, limit = 10) {
    try {
      if (page <= 0 || limit <= 0) {
        return {
          success: false,
          error: "Page dan limit harus lebih dari 0",
        };
      }

      if (limit > 100) {
        return {
          success: false,
          error: "Limit maksimal 100",
        };
      }

      const offset = (page - 1) * limit;
      const reports = await this.reportModel.findAll(limit, offset);

      return {
        success: true,
        data: reports,
        message: `Halaman ${page}, menampilkan ${reports.length} laporan`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteReport(id_report) {
    try {
      if (!id_report || id_report <= 0) {
        return {
          success: false,
          error: "ID report tidak valid",
        };
      }

      const deleted = await this.reportModel.delete(id_report);

      if (!deleted) {
        return {
          success: false,
          error: "Report tidak ditemukan",
        };
      }

      return {
        success: true,
        message: "Report berhasil dihapus",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getReportCount(id_makanan) {
    try {
      if (!id_makanan || id_makanan <= 0) {
        return {
          success: false,
          error: "ID makanan tidak valid",
        };
      }

      const count = await this.reportModel.getReportCount(id_makanan);

      return {
        success: true,
        data: { count },
        message: `Makanan ini memiliki ${count} laporan`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getRecentReports(days = 7) {
    try {
      if (days <= 0 || days > 365) {
        return {
          success: false,
          error: "Jumlah hari harus antara 1-365",
        };
      }

      const reports = await this.reportModel.getRecentReports(days);

      return {
        success: true,
        data: reports,
        message: `Ditemukan ${reports.length} laporan dalam ${days} hari terakhir`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getReportStatistics(days = 30) {
    try {
      if (days <= 0 || days > 365) {
        return {
          success: false,
          error: "Jumlah hari harus antara 1-365",
        };
      }

      const [allReports, recentReports] = await Promise.all([
        this.reportModel.findAll(),
        this.reportModel.getRecentReports(days),
      ]);

      const foodReportCounts = new Map();

      allReports.forEach((report) => {
        const count = foodReportCounts.get(report.id_makanan) || 0;
        foodReportCounts.set(report.id_makanan, count + 1);
      });

      const mostReportedFoods = Array.from(foodReportCounts.entries())
        .map(([id_makanan, report_count]) => ({ id_makanan, report_count }))
        .sort((a, b) => b.report_count - a.report_count)
        .slice(0, 10);

      return {
        success: true,
        data: {
          total_reports: allReports.length,
          recent_reports: recentReports.length,
          most_reported_foods: mostReportedFoods,
        },
        message: "Statistik laporan berhasil dihitung",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getFlagedFoods(minReports = 5) {
    try {
      if (minReports <= 0) {
        return {
          success: false,
          error: "Minimum laporan harus lebih dari 0",
        };
      }

      const allReports = await this.reportModel.findAll();

      const foodReportCounts = new Map();

      allReports.forEach((report) => {
        const count = foodReportCounts.get(report.id_makanan) || 0;
        foodReportCounts.set(report.id_makanan, count + 1);
      });

      const flaggedFoods = Array.from(foodReportCounts.entries())
        .filter(([_, count]) => count >= minReports)
        .map(([id_makanan, report_count]) => ({
          id_makanan,
          report_count,
          status: "flagged",
        }))
        .sort((a, b) => b.report_count - a.report_count);

      return {
        success: true,
        data: flaggedFoods,
        message: `Ditemukan ${flaggedFoods.length} makanan yang memiliki >= ${minReports} laporan`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  validateReportInput(reportData) {
    if (!reportData.id_makanan || reportData.id_makanan <= 0) {
      return { isValid: false, message: "ID makanan harus diisi dan valid" };
    }

    return { isValid: true };
  }

  async bulkDeleteReports(reportIds) {
    try {
      if (!reportIds || reportIds.length === 0) {
        return {
          success: false,
          error: "Daftar ID report tidak boleh kosong",
        };
      }

      if (reportIds.some((id) => !id || id <= 0)) {
        return {
          success: false,
          error: "Semua ID report harus valid",
        };
      }

      let deletedCount = 0;
      const errors = [];

      for (const id of reportIds) {
        try {
          const deleted = await this.reportModel.delete(id);
          if (deleted) {
            deletedCount++;
          } else {
            errors.push(`Report ID ${id} tidak ditemukan`);
          }
        } catch (error) {
          errors.push(`Gagal menghapus report ID ${id}: ${error.message}`);
        }
      }

      return {
        success: deletedCount > 0,
        message: `Berhasil menghapus ${deletedCount} dari ${reportIds.length} laporan`,
        error: errors.length > 0 ? errors.join("; ") : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

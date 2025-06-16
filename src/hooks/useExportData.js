// hooks/useExportData.js (Fixed with better error handling)
import { useState } from "react";

export const useExportData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportToPDF = async (userId, startDate, endDate) => {
    if (!userId || !startDate || !endDate) {
      const errorMsg = "Missing required parameters for export";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId,
        startDate,
        endDate,
      });

      const response = await fetch(`/api/reports/export?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Here you would typically trigger PDF generation
        // For now, just return the data
        return result.data;
      } else {
        throw new Error(result.message || "Failed to export data");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred during export";
      setError(errorMessage);
      console.error("Error exporting data:", err);
      throw err; // Re-throw for component handling
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    exportToPDF,
    loading,
    error,
    clearError,
  };
};

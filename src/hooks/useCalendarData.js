// hooks/useCalendarData.js (Fixed filename typo)
import { useState, useEffect } from "react";

export const useCalendarData = (userId, year, month) => {
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCalendarData = async () => {
    if (!userId || !year || !month) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId,
        year: year.toString(),
        month: month.toString(),
      });

      const response = await fetch(`/api/reports/calendar?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCalendarData(result.data || {});
      } else {
        throw new Error(result.message || "Failed to fetch calendar data");
      }
    } catch (err) {
      const errorMessage =
        err.message || "An error occurred while fetching calendar data";
      setError(errorMessage);
      console.error("Error fetching calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && year && month) {
      fetchCalendarData();
    }
  }, [userId, year, month]);

  return {
    calendarData,
    loading,
    error,
    refetch: fetchCalendarData,
  };
};

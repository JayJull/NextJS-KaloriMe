import { useState, useEffect } from "react";

export const useReports = (userId, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { days = 7, startDate, endDate, autoFetch = true } = options;

  const fetchReports = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId,
        ...(startDate && endDate
          ? { startDate, endDate }
          : { days: days.toString() }),
      });

      const response = await fetch(`/api/reports?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to fetch reports");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && userId) {
      fetchReports();
    }
  }, [userId, days, startDate, endDate, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchReports,
  };
};

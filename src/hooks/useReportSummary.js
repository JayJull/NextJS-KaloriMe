import { useState, useEffect } from 'react';

export const useReportSummary = (userId, days = 7) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId,
        days: days.toString(),
      });

      const response = await fetch(`/api/reports/summary?${params}`);
      const result = await response.json();

      if (result.success) {
        setSummary(result.data);
      } else {
        setError(result.message || "Failed to fetch summary");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSummary();
    }
  }, [userId, days]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
};

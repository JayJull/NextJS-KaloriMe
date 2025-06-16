import { useState, useEffect } from 'react';

export const useCategoryStats = (userId, days = 7) => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategoryStats = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId,
        days: days.toString(),
      });

      const response = await fetch(`/api/reports/categories?${params}`);
      const result = await response.json();

      if (result.success) {
        setCategoryStats(result.data);
      } else {
        setError(result.message || "Failed to fetch category stats");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error fetching category stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCategoryStats();
    }
  }, [userId, days]);

  return {
    categoryStats,
    loading,
    error,
    refetch: fetchCategoryStats,
  };
};

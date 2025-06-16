// hooks/usePaginatedFoods.js (Fixed with better state management)
import { useState, useEffect, useCallback } from "react";

export const usePaginatedFoods = (userId, options = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 7,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { page = 1, itemsPerPage = 7, days = 7, startDate, endDate } = options;

  const fetchPaginatedFoods = useCallback(
    async (currentPage = page) => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          userId,
          page: currentPage.toString(),
          itemsPerPage: itemsPerPage.toString(),
          ...(startDate && endDate
            ? { startDate, endDate }
            : { days: days.toString() }),
        });

        const response = await fetch(`/api/reports/all-foods?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data || []);
          setPagination({
            currentPage: result.pagination?.currentPage || currentPage,
            totalPages: result.pagination?.totalPages || 1,
            totalItems: result.pagination?.totalItems || 0,
            itemsPerPage: result.pagination?.itemsPerPage || itemsPerPage,
            hasNextPage: result.pagination?.hasNextPage || false,
            hasPrevPage: result.pagination?.hasPrevPage || false,
          });
        } else {
          throw new Error(result.message || "Failed to fetch foods");
        }
      } catch (err) {
        const errorMessage =
          err.message || "An error occurred while fetching foods";
        setError(errorMessage);
        console.error("Error fetching paginated foods:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId, itemsPerPage, days, startDate, endDate]
  );

  const goToPage = useCallback(
    (newPage) => {
      if (
        newPage >= 1 &&
        newPage <= pagination.totalPages &&
        newPage !== pagination.currentPage
      ) {
        fetchPaginatedFoods(newPage);
      }
    },
    [pagination.totalPages, pagination.currentPage, fetchPaginatedFoods]
  );

  const goToNextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  }, [pagination.hasNextPage, pagination.currentPage, goToPage]);

  const goToPrevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.currentPage - 1);
    }
  }, [pagination.hasPrevPage, pagination.currentPage, goToPage]);

  useEffect(() => {
    if (userId) {
      fetchPaginatedFoods();
    }
  }, [fetchPaginatedFoods]);

  return {
    data,
    pagination,
    loading,
    error,
    goToPage,
    goToNextPage,
    goToPrevPage,
    refetch: () => fetchPaginatedFoods(pagination.currentPage),
  };
};

import { useState, useEffect } from 'react';

export const useDateRange = () => {
  const getDateRangeByDays = async (days) => {
    try {
      const params = new URLSearchParams({
        days: days.toString(),
      });

      const response = await fetch(`/api/reports/date-range?${params}`);
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        console.error("Failed to get date range:", result.message);
        return null;
      }
    } catch (err) {
      console.error("Error getting date range:", err);
      return null;
    }
  };

  return {
    getDateRangeByDays,
  };
};

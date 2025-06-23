'use client';
import { useState } from 'react';

interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending';
}

export const useSort = (keys: string[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending',
  });

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = (data: any[]) => {
    
    if (!sortConfig.key) return data;
    const key = sortConfig.key as string;
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  return { sortConfig, handleSort, sortedData };
};
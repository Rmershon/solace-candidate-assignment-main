import { useState, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { Advocate } from '../types/advocates';

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UseAdvocatesReturn {
  advocates: Advocate[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  searchAdvocates: (term: string) => void;
  clearSearch: () => void;
  filterBySpecialty: (specialty: string) => void;
  filterByCity: (city: string) => void;
  filterByExperience: (minYears: number, maxYears: number) => void;
  resetFilters: () => void;
  searchResults: {
    total: number;
    hasResults: boolean;
    highlightedSearchTerm: string;
  };
  pagination: PaginationData;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  activeFilters: {
    specialty: string;
    city: string;
    minExperience: number;
    maxExperience: number;
  };
}

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const useAdvocates = (): UseAdvocatesReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [activeFilters, setActiveFilters] = useState({
    specialty: '',
    city: '',
    minExperience: 0,
    maxExperience: 50,
  });

  // Build query parameters for API call
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
    });

    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    if (activeFilters.specialty) {
      params.append('specialty', activeFilters.specialty);
    }
    if (activeFilters.city) {
      params.append('city', activeFilters.city);
    }
    if (activeFilters.minExperience > 0) {
      params.append('minExperience', activeFilters.minExperience.toString());
    }
    if (activeFilters.maxExperience < 50) {
      params.append('maxExperience', activeFilters.maxExperience.toString());
    }

    return params.toString();
  }, [currentPage, pageSize, searchTerm, activeFilters]);

  // SWR hook for data fetching
  const { data, error, isLoading, mutate } = useSWR(
    `/api/advocates?${queryParams}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  const advocates = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Debounced search function
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (searchValue: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSearchTerm(searchValue);
        setCurrentPage(1); // Reset to first page on search
      }, 300);
    };
  }, []);

  const searchAdvocates = useCallback((term: string) => {
    debouncedSearch(term);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const filterBySpecialty = useCallback((specialty: string) => {
    setActiveFilters(prev => ({ ...prev, specialty }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const filterByCity = useCallback((city: string) => {
    setActiveFilters(prev => ({ ...prev, city }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const filterByExperience = useCallback((minYears: number, maxYears: number) => {
    setActiveFilters(prev => ({ 
      ...prev, 
      minExperience: minYears, 
      maxExperience: maxYears 
    }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters({
      specialty: '',
      city: '',
      minExperience: 0,
      maxExperience: 50,
    });
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Pagination controls
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  }, [pagination.totalPages]);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [pagination.hasNextPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [pagination.hasPrevPage]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const searchResults = useMemo(() => ({
    total: pagination.total,
    hasResults: advocates.length > 0,
    highlightedSearchTerm: searchTerm.trim(),
  }), [pagination.total, advocates.length, searchTerm]);

  return {
    advocates,
    searchTerm,
    isLoading,
    error: error?.message || null,
    searchAdvocates,
    clearSearch,
    filterBySpecialty,
    filterByCity,
    filterByExperience,
    resetFilters,
    searchResults,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    setPageSize: setPageSizeHandler,
    activeFilters,
  };
}; 
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Advocate } from '../types/advocates';

export interface UseAdvocatesReturn {
  advocates: Advocate[];
  filteredAdvocates: Advocate[];
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
}

export const useAdvocates = (): UseAdvocatesReturn => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    specialty: '',
    city: '',
    minExperience: 0,
    maxExperience: 50,
  });

  // Fetch advocates on mount
  useEffect(() => {
    const fetchAdvocates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/advocates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Error fetching advocates: ${errorMessage}`);
        setAdvocates([]);
        setFilteredAdvocates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  // Debounced search function
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (searchValue: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        applyFilters(searchValue);
      }, 300);
    };
  }, [advocates, activeFilters]);

  // Apply all filters including search term
  const applyFilters = useCallback((searchValue: string = searchTerm) => {
    let filtered = [...advocates];

    // Apply search term filter
    if (searchValue.trim()) {
      const normalizedSearchTerm = searchValue.toLowerCase().trim();
      filtered = filtered.filter((advocate: Advocate) => {
        const searchFields = [
          advocate.firstName.toLowerCase(),
          advocate.lastName.toLowerCase(),
          advocate.city.toLowerCase(),
          advocate.degree.toLowerCase(),
          advocate.yearsOfExperience.toString(),
          ...advocate.specialties.map(s => s.toLowerCase())
        ];
        
        return searchFields.some(field => field.includes(normalizedSearchTerm));
      });
    }

    // Apply specialty filter
    if (activeFilters.specialty) {
      filtered = filtered.filter(advocate => 
        advocate.specialties.some(specialty => 
          specialty.toLowerCase().includes(activeFilters.specialty.toLowerCase())
        )
      );
    }

    // Apply city filter
    if (activeFilters.city) {
      filtered = filtered.filter(advocate => 
        advocate.city.toLowerCase().includes(activeFilters.city.toLowerCase())
      );
    }

    // Apply experience filter
    filtered = filtered.filter(advocate => 
      advocate.yearsOfExperience >= activeFilters.minExperience &&
      advocate.yearsOfExperience <= activeFilters.maxExperience
    );

    setFilteredAdvocates(filtered);
  }, [advocates, searchTerm, activeFilters]);

  // Re-apply filters when advocates or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const searchAdvocates = useCallback((term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    applyFilters('');
  }, [applyFilters]);

  const filterBySpecialty = useCallback((specialty: string) => {
    setActiveFilters(prev => ({ ...prev, specialty }));
  }, []);

  const filterByCity = useCallback((city: string) => {
    setActiveFilters(prev => ({ ...prev, city }));
  }, []);

  const filterByExperience = useCallback((minYears: number, maxYears: number) => {
    setActiveFilters(prev => ({ 
      ...prev, 
      minExperience: minYears, 
      maxExperience: maxYears 
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters({
      specialty: '',
      city: '',
      minExperience: 0,
      maxExperience: 50,
    });
    setSearchTerm('');
  }, []);

  const searchResults = useMemo(() => ({
    total: filteredAdvocates.length,
    hasResults: filteredAdvocates.length > 0,
    highlightedSearchTerm: searchTerm.trim(),
  }), [filteredAdvocates.length, searchTerm]);

  return {
    advocates,
    filteredAdvocates,
    searchTerm,
    isLoading,
    error,
    searchAdvocates,
    clearSearch,
    filterBySpecialty,
    filterByCity,
    filterByExperience,
    resetFilters,
    searchResults,
  };
}; 
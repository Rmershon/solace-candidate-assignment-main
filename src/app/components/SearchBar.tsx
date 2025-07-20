import { useCallback, useMemo } from "react";
import { Advocate } from "../types/advocates";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  advocates: Advocate[];
  setFilteredAdvocates: (advocates: Advocate[]) => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  onClearSearch,
  advocates,
  setFilteredAdvocates,
}: SearchBarProps) {
  // Debounced search with case-insensitive matching
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (searchValue: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const normalizedSearchTerm = searchValue.toLowerCase().trim();
        
        if (!normalizedSearchTerm) {
          setFilteredAdvocates(advocates);
          return;
        }

        const filtered = advocates.filter((advocate: Advocate) => {
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

        setFilteredAdvocates(filtered);
      }, 300); // 300ms debounce delay
    };
  }, [advocates, setFilteredAdvocates]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    onSearchChange(newSearchTerm);
    debouncedSearch(newSearchTerm);
  }, [onSearchChange, debouncedSearch]);

  return (
    <div className="mb-6">
      <p className="mb-2">Search</p>
      <p className="mb-2">
        Searching for: <span className="font-semibold">{searchTerm || "All advocates"}</span>
      </p>
      <div className="flex gap-2">
        <input
          className="border border-gray-300 px-3 py-2 rounded flex-1"
          onChange={handleChange}
          value={searchTerm}
          placeholder="Search advocates..."
        />
        <button 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={onClearSearch}
        >
          Reset Search
        </button>
      </div>
    </div>
  );
} 
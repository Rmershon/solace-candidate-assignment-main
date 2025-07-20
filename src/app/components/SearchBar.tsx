"use client";

import { useAdvocatesContext } from "../context/AdvocatesContext";
import { useState, useEffect } from "react";

export default function EnhancedSearchBar() {
  const { searchTerm, searchAdvocates, clearSearch, searchResults } = useAdvocatesContext();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    searchAdvocates(value);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    clearSearch();
  };

  const quickSearchSuggestions = [
    'Anxiety', 'Depression', 'Trauma', 'PTSD', 'Substance abuse', 
    'Relationship issues', 'Family therapy', 'Personal growth'
  ];

  return (
    <div className="space-y-4">
      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={localSearchTerm}
          onChange={handleInputChange}
          placeholder="Search by name, specialty, location, or experience..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
        />
        {localSearchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick Search Suggestions */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 font-medium">Quick search:</span>
        {quickSearchSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setLocalSearchTerm(suggestion);
              searchAdvocates(suggestion);
            }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Search Tips */}
      {!searchTerm && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-teal-800">Search Tips</h3>
              <div className="mt-2 text-sm text-teal-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Search by specialty (e.g., "trauma", "anxiety", "family therapy")</li>
                  <li>Filter by location or years of experience</li>
                  <li>Use the quick search buttons above for common specialties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

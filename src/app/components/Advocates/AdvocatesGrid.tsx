"use client";

import { useAdvocatesContext } from "../../context/AdvocatesContext";
import AdvocateCard from "./AdvocateCard";

export default function AdvocatesGrid() {
  const { filteredAdvocates, searchResults } = useAdvocatesContext();

  return (
    <div className="space-y-4">
      {/* View Toggle - Could add table/card view toggle here */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {searchResults.total} advocate{searchResults.total !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Click "Contact Advocate" to get in touch
        </div>
      </div>

      {/* Advocates Grid */}
      <div className="space-y-4">
        {filteredAdvocates.map((advocate, index) => (
          <AdvocateCard 
            key={`advocate-${index}`} 
            advocate={advocate} 
            searchTerm={searchResults.highlightedSearchTerm}
          />
        ))}
      </div>

      {/* Load More / Pagination could go here if needed */}
      {filteredAdvocates.length > 10 && (
        <div className="text-center pt-6">
          <p className="text-sm text-gray-500">
            Showing all {filteredAdvocates.length} results
          </p>
        </div>
      )}
    </div>
  );
};

"use client";

import { useAdvocatesContext } from "../../context/AdvocatesContext";
import LoadingState from "../LoadingState";
import NoResultsState from "../NoResultsState";
import AdvocateCard from "./AdvocateCard";

export default function AdvocatesGrid() {
  const { advocates, searchResults, pagination, isLoading, searchTerm } = useAdvocatesContext();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!searchResults.hasResults) {
    return <NoResultsState searchTerm={searchTerm} />;
  }

  return (
    <div className="space-y-4">
      {/* View Toggle - Could add table/card view toggle here */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {advocates.length} of {searchResults.total} advocate{searchResults.total !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Click "Contact Advocate" to get in touch
        </div>
      </div>

      {/* Advocates Grid */}
      <div className="space-y-4">
        {advocates.map((advocate, index) => (
          <AdvocateCard 
            key={`advocate-${advocate.id || index}`} 
            advocate={advocate} 
            searchTerm={searchResults.highlightedSearchTerm}
          />
        ))}
      </div>

      {/* Pagination info */}
      {pagination.totalPages > 1 && (
        <div className="text-center pt-6">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} 
            ({pagination.total} total results)
          </p>
        </div>
      )}
    </div>
  );
};

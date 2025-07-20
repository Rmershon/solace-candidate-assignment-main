"use client";

import { useAdvocatesContext } from "../context/AdvocatesContext";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import NoResultsState from "./NoResultsState";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import { AdvocatesGrid } from "./Advocates";

export default function AdvocatesPageContent() {
  const {
    isLoading,
    error,
    searchResults,
    searchTerm
  } = useAdvocatesContext();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Find Your Advocate
            </h1>
            <p className="text-xl text-gray-600">
              Connect with mental health professionals who understand your needs
            </p>
          </div>
          <LoadingState />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Find Your Advocate
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Connect with mental health professionals who understand your needs
          </p>
          
          {/* Search Results Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold text-blue-600">{searchResults.total}</span>
                advocates found
              </span>
              {searchTerm && (
                <span className="text-gray-500">
                  for "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="p-6">
            <SearchBar />
            <FilterPanel />
          </div>
        </div>

        {/* Error State */}
        {error && <ErrorState error={error} />}

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {searchResults.hasResults ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Available Advocates
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {searchResults.total} results
                </div>
              </div>
              <AdvocatesGrid />
            </div>
          ) : (
            <div className="p-6">
              <NoResultsState searchTerm={searchTerm} />
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Need Help Finding the Right Advocate?</h3>
            <p className="text-blue-100 mb-4">
              Our advocates are here to support you through various mental health challenges and life transitions.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Anxiety & Depression', 'Trauma & PTSD', 'Relationship Issues', 'Substance Abuse', 'Family Support'].map((topic) => (
                <span key={topic} className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

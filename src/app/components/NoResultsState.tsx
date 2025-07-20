"use client";

import { useAdvocatesContext } from "../context/AdvocatesContext";

interface NoResultsStateProps {
  searchTerm: string;
}

export default function NoResultsState({ searchTerm }: NoResultsStateProps) {
  const { searchAdvocates } = useAdvocatesContext();

  const suggestions = [
    "Try different keywords or specialties",
    "Check your spelling",
    "Use broader search terms",
    "Remove some filters to see more results",
    "Search for related mental health topics"
  ];

  const popularSearches = [
    "Anxiety", "Depression", "Trauma", "PTSD", "Family therapy", "Substance abuse"
  ];

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Main Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No advocates found
        </h3>
        
        <p className="text-gray-600 mb-6">
          {searchTerm 
            ? `We couldn't find any advocates matching "${searchTerm}".`
            : "No advocates are currently available with your current filters."
          }
        </p>

        {/* Suggestions */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-teal-900 mb-3">Try these suggestions:</h4>
          <ul className="text-sm text-teal-800 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-3 h-3 text-teal-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Searches */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Popular searches:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularSearches.map((search) => (
              <button
                key={search}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-200"
                onClick={() => {
                  searchAdvocates(search);
                }}
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Help */}
        <div className="mt-8 p-4 rounded-lg text-white" style={{background: 'linear-gradient(to right, #347866, #10B981)'}}>
          <h4 className="text-sm font-semibold mb-1">Need additional help?</h4>
          <p className="text-sm text-teal-100 mb-3">
            Our support team can help you find the right advocate for your specific needs.
          </p>
          <button className="bg-white text-teal-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-50 transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

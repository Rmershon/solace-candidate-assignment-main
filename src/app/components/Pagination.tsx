"use client";

import React from 'react';
import { PaginationData } from '../hooks/useAdvocates';

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
}) => {
  const { page, totalPages, hasNextPage, hasPrevPage, total, limit } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 border-t border-gray-200">
      {/* Results info and page size selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
        <div>
          Showing {startItem}-{endItem} of {total} results
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm font-medium">
            Show:
          </label>
          <select
            id="pageSize"
            value={limit}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm">per page</span>
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              hasPrevPage
                ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
            }`}
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => (
              <React.Fragment key={index}>
                {pageNum === '...' ? (
                  <span className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(pageNum as number)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pageNum === page
                        ? 'text-white bg-teal-600 border border-teal-600'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500'
                    }`}
                  >
                    {pageNum}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={onNextPage}
            disabled={!hasNextPage}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              hasNextPage
                ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination; 
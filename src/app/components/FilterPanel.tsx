"use client";

import { useAdvocatesContext } from "../context/AdvocatesContext";
import { useState, useMemo } from "react";

export default function FilterPanel() {
  const { 
    advocates, 
    filterBySpecialty, 
    filterByCity, 
    filterByExperience, 
    resetFilters 
  } = useAdvocatesContext();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [experienceRange, setExperienceRange] = useState({ min: 0, max: 50 });

  // Extract unique specialties and cities from advocates data
  const { uniqueSpecialties, uniqueCities, experienceStats } = useMemo(() => {
    const specialties = new Set<string>();
    const cities = new Set<string>();
    let minExp = Infinity;
    let maxExp = -Infinity;

    advocates.forEach(advocate => {
      advocate.specialties.forEach(specialty => specialties.add(specialty));
      cities.add(advocate.city);
      minExp = Math.min(minExp, advocate.yearsOfExperience);
      maxExp = Math.max(maxExp, advocate.yearsOfExperience);
    });

    return {
      uniqueSpecialties: Array.from(specialties).sort(),
      uniqueCities: Array.from(cities).sort(),
      experienceStats: { min: minExp === Infinity ? 0 : minExp, max: maxExp === -Infinity ? 50 : maxExp }
    };
  }, [advocates]);

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    filterBySpecialty(specialty);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    filterByCity(city);
  };

  const handleExperienceChange = (min: number, max: number) => {
    setExperienceRange({ min, max });
    filterByExperience(min, max);
  };

  const handleReset = () => {
    setSelectedSpecialty('');
    setSelectedCity('');
    setExperienceRange({ min: 0, max: 50 });
    resetFilters();
  };

  const hasActiveFilters = selectedSpecialty || selectedCity || experienceRange.min > 0 || experienceRange.max < 50;

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">
          Advanced Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
              Active
            </span>
          )}
        </h3>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Specialties</option>
              {uniqueSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Location
            </label>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Locations</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={experienceStats.min}
                  max={experienceStats.max}
                  value={experienceRange.min}
                  onChange={(e) => handleExperienceChange(Number(e.target.value), experienceRange.max)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min={experienceStats.min}
                  max={experienceStats.max}
                  value={experienceRange.max}
                  onChange={(e) => handleExperienceChange(experienceRange.min, Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <span className="text-gray-500">years</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

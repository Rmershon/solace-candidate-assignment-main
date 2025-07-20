import { Advocate } from "@/app/types/advocates";
import HighlightedText from "../HighlightedText";
import { memo } from "react";

interface AdvocateCardProps {
  advocate: Advocate;
  searchTerm: string;
}

interface SpecialtyPillProps {
  specialty: string;
  color: 'teal' | 'gray';
  searchTerm: string;
  truncate?: boolean;
}

const SpecialtyPill = ({ specialty, color, searchTerm, truncate = false }: SpecialtyPillProps) => {
  const colorClass = color === 'teal' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600';

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 text-xs text-center font-medium rounded-full max-w-full ${colorClass}`}
      title={specialty}
    >
      <span className={`${truncate ? 'truncate max-w-[120px]' : ''}`}>
        <HighlightedText text={specialty} searchTerm={searchTerm} />
      </span>
    </span>
  );
};

const LocationInfo = memo(({ advocate, searchTerm }: { advocate: Advocate, searchTerm: string }) => {
  return (
    <div className="lg:col-span-1">
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <HighlightedText text={advocate.city} searchTerm={searchTerm} />
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {advocate.yearsOfExperience} years of experience
        </div>
      </div>
    </div>
  )
});

export default function AdvocateCard({ advocate, searchTerm }: AdvocateCardProps) {
        
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Basic Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-teal-700 font-semibold text-lg">
                  {advocate.firstName.charAt(0)}{advocate.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  <HighlightedText text={`${advocate.firstName} ${advocate.lastName}`} searchTerm={searchTerm} />
                </h3>
                <p className="text-sm text-gray-600">
                  <HighlightedText text={advocate.degree} searchTerm={searchTerm} />
                </p>
              </div>
            </div>
          </div>
  
          {/* Location & Experience */}
          <LocationInfo advocate={advocate} searchTerm={searchTerm} />
  
          {/* Specialties */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {advocate.specialties.slice(0, 3).map((specialty, index) => (
                <SpecialtyPill key={index} specialty={specialty} color="teal" searchTerm={searchTerm} truncate={true} />
              ))}
              {advocate.specialties.length > 3 && (
                <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  +{advocate.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
  
          {/* Contact & Action */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {advocate.phoneNumber.toString()}
              </div>
              <button 
                className="w-full text-white py-2 px-4 rounded-md hover:opacity-90 transition-all duration-200 text-sm font-medium"
                style={{backgroundColor: '#347866'}}
              >
                Contact Advocate
              </button>
            </div>
          </div>
        </div>
  
        {/* Expanded specialties on hover/mobile */}
        {advocate.specialties.length > 3 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <details className="group">
              <summary className="text-sm text-teal-600 cursor-pointer hover:text-teal-800">
                View all specialties ({advocate.specialties.length})
              </summary>
              <div className="mt-3 flex flex-wrap gap-2">
                {advocate.specialties.map((specialty, index) => (
                  <SpecialtyPill key={index} specialty={specialty} color="gray" searchTerm={searchTerm} truncate={false} />
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    );
  }
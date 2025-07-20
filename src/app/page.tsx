"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

import { Advocate } from "./types/advocates";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      })
      .catch((error) => {
        console.error("Error fetching advocates:", error);
        setAdvocates([]);
        setFilteredAdvocates([]);
        setError(`Error fetching advocates: ${error}`);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

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
  }, [advocates]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    debouncedSearch(newSearchTerm);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  }, [advocates]);

  /* TODO: 
    FUTURE - Add pagination, sorting, and filtering (e.g. search, sort, filter)
    FUTURE - Add a loading state
    FUTURE - Add a error state (e.g. no advocates found)
    FUTURE - Add a success state (e.g. advocates found)
    FUTURE - Add a no results state (e.g. no advocates found)
  */

  return (
    <main className="m-6">
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          className="border border-black"
          onChange={onChange}
          value={searchTerm}
        />
        <button onClick={clearSearch}>Reset Search</button>
      </div>
      <br />
      <br />
      {error && <p className="text-red-500">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        {isLoading && <p>Loading advocates...</p>}
        {filteredAdvocates.length === 0 && !isLoading && (
          <p>No advocates found</p>
        )}
        {!isLoading && filteredAdvocates.length > 0 && (
          <tbody>

            {filteredAdvocates.map((advocate: Advocate) => {
              return (
                <tr key={advocate.id}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties?.map((s: string, index: number) => (
                      <div key={index}>{s}</div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </main>
  );
}

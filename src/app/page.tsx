"use client";

import { useEffect, useState } from "react";
import { Advocate } from "./types/advocates";
import SearchBar from "./components/SearchBar";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import NoResultsState from "./components/NoResultsState";
import { AdvocatesTable } from "./components/AdvocatesTable";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
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
        setAdvocates([]);
        setFilteredAdvocates([]);
        setError(`Error fetching advocates: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  if (isLoading) {
    return (
      <main className="m-6">
        <h1 className="text-2xl font-bold mb-6">Solace Advocates</h1>
        <LoadingState />
      </main>
    );
  }

  return (
    <main className="m-6">
      <h1 className="text-2xl font-bold mb-6">Solace Advocates</h1>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        advocates={advocates}
        setFilteredAdvocates={setFilteredAdvocates}
      />

      {error && <ErrorState error={error} />}

      {filteredAdvocates.length === 0 ? (
        <NoResultsState searchTerm={searchTerm} />
      ) : (
        <AdvocatesTable advocates={filteredAdvocates} />
      )}

    </main>
  );
}

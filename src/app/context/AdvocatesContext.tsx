"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdvocates, UseAdvocatesReturn } from '../hooks/useAdvocates';

const AdvocatesContext = createContext<UseAdvocatesReturn | undefined>(undefined);

interface AdvocatesProviderProps {
  children: ReactNode;
}

export const AdvocatesProvider: React.FC<AdvocatesProviderProps> = ({ children }) => {
  const advocatesState = useAdvocates();

  return (
    <AdvocatesContext.Provider value={advocatesState}>
      {children}
    </AdvocatesContext.Provider>
  );
};

export const useAdvocatesContext = (): UseAdvocatesReturn => {
  const context = useContext(AdvocatesContext);
  if (context === undefined) {
    throw new Error('useAdvocatesContext must be used within an AdvocatesProvider');
  }
  return context;
};

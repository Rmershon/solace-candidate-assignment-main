"use client";

import { AdvocatesProvider } from "./context/AdvocatesContext";
import AdvocatesPageContent from "./components/AdvocatesPageContent";

export default function Home() {
  return (
    <AdvocatesProvider>
      <AdvocatesPageContent />
    </AdvocatesProvider>
  );
}

interface NoResultsStateProps {
  searchTerm: string;
}

export default function NoResultsState({ searchTerm }: NoResultsStateProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-2">No advocates found</h3>
      <p className="text-gray-500">
        {searchTerm 
          ? `No advocates match "${searchTerm}". Try adjusting your search terms.`
          : "No advocates are currently available."
        }
      </p>
    </div>
  );
}

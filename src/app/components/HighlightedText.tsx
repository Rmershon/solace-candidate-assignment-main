

export default function HighlightedText({ text, searchTerm }: { text: string, searchTerm: string }) {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => 
    regex.test(part) ? (
    <mark key={index} className="bg-yellow-200 px-1 rounded">
        {part}
    </mark>
    ) : part
  );
};
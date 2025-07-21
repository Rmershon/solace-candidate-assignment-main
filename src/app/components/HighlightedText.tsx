interface HighlightedTextProps { text: string; searchTerm: string }

export default function HighlightedText({ text, searchTerm }: HighlightedTextProps) {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => 
    regex.test(part) ? (
    <mark key={index} className="bg-teal-100 text-teal-900 px-1 rounded">
        {part}
    </mark>
    ) : part
  );
}
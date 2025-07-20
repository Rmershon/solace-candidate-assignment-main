import { Advocate } from "../../types/advocates";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface AdvocatesTableProps {
  advocates: Advocate[];
}

export default function AdvocatesTable({ advocates }: AdvocatesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <TableHeader />
        <tbody>
          {advocates.map((advocate: Advocate, index: number) => (
            <TableRow key={`advocate-${index}`} advocate={advocate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

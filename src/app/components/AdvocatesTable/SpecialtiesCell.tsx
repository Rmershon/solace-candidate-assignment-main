interface SpecialtiesCellProps {
  specialties: string[];
}

export default function SpecialtiesCell({ specialties }: SpecialtiesCellProps) {
  return (
    <div className="space-y-1">
      {specialties?.map((specialty: string, index: number) => (
        <div key={index} className="text-sm text-gray-700">
          {specialty}
        </div>
      ))}
    </div>
  );
}

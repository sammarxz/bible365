import { ChevronRight } from "lucide-react";

interface ReadingCardProps {
  title: string;
  reference: string;
  isCompleted?: boolean;
  onSelect: () => void;
  className?: string;
}

export function ReadingCard({
  title,
  reference,
  isCompleted = false,
  onSelect,
  className = "bg-white border-gray-100",
}: ReadingCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl mb-3 text-left transition-all border
        ${className} 
        ${isCompleted ? "opacity-50" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{reference}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
}

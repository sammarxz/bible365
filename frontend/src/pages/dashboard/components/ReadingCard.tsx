import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  reference: string;
  isCompleted?: boolean;
  onSelect: () => void;
}

export function ReadingCard({
  title,
  reference,
  isCompleted = false,
  onSelect,
}: Props) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg mb-3 text-left transition-all
        ${
          isCompleted
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-white border"
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-500">{reference}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-400" />
      </div>
    </button>
  );
}

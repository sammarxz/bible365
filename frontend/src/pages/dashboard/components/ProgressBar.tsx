interface Props {
  progress: number;
  total: number;
}

export function ProgressBar({ progress, total }: Props) {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

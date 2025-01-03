interface ProgressCardProps {
  title: string;
  value: number;
  total: number;
  percent: number;
}

export function ProgressCard({
  title,
  value,
  total,
  percent,
}: ProgressCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">
            {value}/{total}
          </span>
          <span className="text-sm font-medium">{percent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

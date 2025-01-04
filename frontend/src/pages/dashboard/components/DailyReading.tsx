import { Check, Share2 } from "lucide-react";

import { Reading, READING_TYPE_LABELS } from "../../../types";

interface Props {
  reading: Reading;
  onComplete: (id: string) => void;
  onShare: (text: string, reference: string) => void;
}

export function DailyReading({ reading, onComplete, onShare }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Leitura do Dia</h2>
        <button
          onClick={() => onComplete(reading.id)}
          className={`p-2 rounded-full ${
            reading.completed
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Check
            className={reading.completed ? "text-green-600" : "text-gray-400"}
          />
        </button>
      </div>

      <div className="space-y-4">
        {reading.readings.map((section, index) => (
          <Section
            key={index}
            title={READING_TYPE_LABELS[section.type]}
            content={section.reference}
            onShare={() => onShare(section.reference, section.type)}
          />
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  content,
  onShare,
}: {
  title: string;
  content: string;
  onShare: () => void;
}) {
  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <button
          onClick={onShare}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Share2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <p className="text-gray-600 mt-1">{content}</p>
    </div>
  );
}

import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Share2 } from "lucide-react";
import { motion } from "motion/react";

import { getVerse } from "../../../services/bible";
import { cacheReading, getCachedReading } from "../../../services/cache";

const READING_TYPE_COLORS = {
  "old-testament": {
    header: "bg-blue-50 border-blue-100",
    icon: "text-blue-600 bg-blue-50",
    text: "text-blue-800",
  },
  "new-testament": {
    header: "bg-green-50 border-green-100",
    icon: "text-green-600 bg-green-50",
    text: "text-green-800",
  },
  psalms: {
    header: "bg-purple-50 border-purple-100",
    icon: "text-purple-600 bg-purple-50",
    text: "text-purple-800",
  },
  proverbs: {
    header: "bg-yellow-50 border-yellow-100",
    icon: "text-yellow-600 bg-yellow-50",
    text: "text-yellow-800",
  },
} as const;

interface Props {
  title: string;
  reference: string;
  onBack: () => void;
  onShare: (text: string, reference: string) => void;
  isCompleted?: boolean;
  onComplete?: () => void;
  type?: keyof typeof READING_TYPE_COLORS;
}

export function ReadingView({
  title,
  reference,
  onBack,
  onShare,
  type = "old-testament",
}: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = READING_TYPE_COLORS[type];

  async function loadText() {
    try {
      setLoading(true);
      setError(null);

      const cachedText = await getCachedReading(reference);
      if (cachedText) {
        setText(cachedText);
        setLoading(false);
        return;
      }

      const verseText = await getVerse(reference);
      setText(verseText);

      await cacheReading(reference, verseText);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar o texto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-white overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <header
          className={`sticky top-0 bg-white border-b shadow-sm ${colors.header}`}
        >
          <div className="max-w-lg mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={onBack}
                className={`p-2 rounded-full hover:bg-white/50 transition-colors ${colors.icon}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <h2 className={`text-lg font-semibold ${colors.text}`}>
                {title}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShare(text, reference)}
                  className={`p-2 rounded-full hover:bg-white/50 transition-colors ${colors.icon}`}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-8">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadText}
                className="inline-flex items-center gap-2 text-blue-600 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar novamente</span>
              </button>
            </div>
          ) : (
            <div>
              <h3 className={`text-xl font-semibold mb-6 ${colors.text}`}>
                {reference}
              </h3>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed text-lg">{text}</p>
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </>
  );
}

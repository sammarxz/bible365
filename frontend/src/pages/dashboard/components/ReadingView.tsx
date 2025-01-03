import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Share2 } from "lucide-react";
import { motion } from "motion/react";

import { getVerse } from "../../../services/bible";
import { cacheReading, getCachedReading } from "../../../services/cache";

interface Props {
  title: string;
  reference: string;
  onBack: () => void;
  onShare: (text: string, reference: string) => void;
  isCompleted?: boolean;
  onComplete?: () => void;
}

export function ReadingView({ title, reference, onBack, onShare }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadText() {
    try {
      setLoading(true);
      setError(null);

      // Try to get from cache first
      const cachedText = await getCachedReading(reference);
      if (cachedText) {
        setText(cachedText);
        setLoading(false);
        return;
      }

      // If not in cache, fetch from API
      const verseText = await getVerse(reference);
      setText(verseText);

      // Cache the result
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
    <motion.div
      className="fixed inset-0 bg-white overflow-y-auto"
      initial={{ x: "100%" }}
      animate={{ x: 0, transition: { duration: 0.3 } }}
      exit={{ x: "100%", transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <header className="sticky top-0 bg-white border-b shadow-sm">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold">{title}</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onShare(text, reference)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {reference}
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed text-lg">{text}</p>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
}

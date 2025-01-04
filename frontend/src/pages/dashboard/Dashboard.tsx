import { useState, useEffect } from "react";
import { Book } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ReadingPlanGenerator } from "../../services/reading-plan";
import { ReadingCard } from "./components/ReadingCard";
import { ReadingView } from "./components/ReadingView";
import { ShareModal } from "./components/ShareModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProgressStats } from "./components/ProgressStats";
import { useProgress } from "../../hooks/useProgress";
import { CompleteButton } from "./components/CompleteButton";
import { SelectedReading, ShareContent, TodayReading } from "../../types";

const READING_TYPE_LABELS = {
  "old-testament": "Antigo Testamento",
  "new-testament": "Novo Testamento",
  psalms: "Salmos",
  proverbs: "Provérbios",
} as const;

const READING_TYPE_COLORS = {
  "old-testament": "bg-blue-50 border-blue-200",
  "new-testament": "bg-green-50 border-green-200",
  psalms: "bg-purple-50 border-purple-200",
  proverbs: "bg-yellow-50 border-yellow-200",
} as const;

export function Dashboard() {
  const { completedReadings, completeReading, isCompleted } = useProgress();
  const [selectedReading, setSelectedReading] =
    useState<SelectedReading | null>(null);
  const [shareContent, setShareContent] = useState<ShareContent | null>(null);
  const [todaysReadings, setTodaysReadings] = useState<TodayReading | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeReadings() {
      try {
        const generator = new ReadingPlanGenerator();
        await generator.initialize();
        const today = await generator.getToday();

        if (today) {
          setTodaysReadings({
            id: today.id,
            readings: today.readings.map((reading) => ({
              ...reading,
              reference: generator.getReadingText(reading),
            })),
          });
        }
      } catch (error) {
        console.error("Error initializing readings:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeReadings();
  }, []);

  const handleCompleteDay = () => {
    if (todaysReadings) {
      completeReading(todaysReadings.id);
    }
  };

  const handleShare = (text: string, reference: string) => {
    setShareContent({ text, reference });
  };

  const isDayCompleted = todaysReadings
    ? isCompleted(todaysReadings.id)
    : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <header className="bg-white border-b">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <Book className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Bíblia 365</h1>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <LayoutGroup>
            <motion.div layout>
              <ProgressStats completedReadings={completedReadings} />
            </motion.div>

            <motion.div layout className="space-y-6">
              {Object.entries(READING_TYPE_LABELS).map(([type, label]) => {
                const typeReadings = todaysReadings?.readings.filter(
                  (r) => r.type === type
                );

                if (!typeReadings?.length) return null;

                return (
                  <div key={type} className="space-y-2">
                    <h2 className="font-medium text-gray-900">{label}</h2>
                    {typeReadings.map((reading, index) => (
                      <ReadingCard
                        key={`${type}-${index}`}
                        title={reading.book}
                        reference={reading.reference}
                        isCompleted={isDayCompleted}
                        onSelect={() =>
                          setSelectedReading({
                            book: reading.book,
                            reference: reading.reference,
                            type: reading.type,
                          })
                        }
                        className={
                          READING_TYPE_COLORS[
                            reading.type as keyof typeof READING_TYPE_COLORS
                          ]
                        }
                      />
                    ))}
                  </div>
                );
              })}
            </motion.div>

            <motion.div layout>
              <CompleteButton
                onComplete={handleCompleteDay}
                isCompleted={isDayCompleted}
              />
            </motion.div>
          </LayoutGroup>
        </main>

        <AnimatePresence>
          {selectedReading && (
            <ReadingView
              title={selectedReading.book}
              reference={selectedReading.reference}
              type={selectedReading.type}
              onBack={() => setSelectedReading(null)}
              onShare={handleShare}
              isCompleted={isDayCompleted}
              onComplete={handleCompleteDay}
            />
          )}
        </AnimatePresence>

        <ShareModal
          content={shareContent}
          onClose={() => setShareContent(null)}
        />
      </div>
    </ErrorBoundary>
  );
}

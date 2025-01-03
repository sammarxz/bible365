import { useState } from "react";
import { Book } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { ReadingCard } from "./components/ReadingCard";
import { ReadingView } from "./components/ReadingView";
import { ShareModal } from "./components/ShareModal";

import { dailyReadings } from "../../data/readings";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProgressStats } from "./components/ProgressStats";
import { useProgress } from "../../hooks/useProgress";
import { CompleteButton } from "./components/CompleteButton";

export function Dashboard() {
  const { completedReadings, completeReading, isCompleted } = useProgress();
  const [selectedReading, setSelectedReading] = useState<{
    title: string;
    reference: string;
  } | null>(null);
  const [shareContent, setShareContent] = useState<{
    text: string;
    reference: string;
  } | null>(null);

  const reading = dailyReadings[0]; // Leitura do dia atual

  const handleCompleteDay = () => {
    completeReading(reading.id);
  };

  const handleShare = (text: string, reference: string) => {
    setShareContent({ text, reference });
  };

  const isDayCompleted = isCompleted(reading.id);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gray-50`}>
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
            {/* Progress Stats with layout animations */}
            <motion.div layout>
              <ProgressStats completedReadings={completedReadings} />
            </motion.div>

            {/* Complete Button */}
            <motion.div layout>
              <CompleteButton
                onComplete={handleCompleteDay}
                isCompleted={isDayCompleted}
              />
            </motion.div>

            {/* Reading Cards */}
            <motion.div layout className="space-y-2">
              {[
                { title: "Antigo Testamento", reference: reading.oldTestament },
                { title: "Novo Testamento", reference: reading.newTestament },
                { title: "Salmos", reference: reading.psalms },
                { title: "Provérbios", reference: reading.proverbs },
              ].map((item, index) => (
                <ReadingCard
                  key={index}
                  title={item.title}
                  reference={item.reference}
                  isCompleted={isCompleted(reading.id)}
                  onSelect={() =>
                    setSelectedReading({
                      title: item.title,
                      reference: item.reference,
                    })
                  }
                />
              ))}
            </motion.div>
          </LayoutGroup>
        </main>

        <AnimatePresence>
          {selectedReading && (
            <ReadingView
              title={selectedReading.title}
              reference={selectedReading.reference}
              onBack={() => setSelectedReading(null)}
              onShare={handleShare}
              isCompleted={isCompleted(reading.id)}
              onComplete={() => completeReading(reading.id)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          <ShareModal
            content={shareContent}
            onClose={() => setShareContent(null)}
          />
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

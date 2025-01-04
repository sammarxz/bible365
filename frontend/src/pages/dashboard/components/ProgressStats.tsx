import { BookOpen, Flame, Calendar, ChevronDown } from "lucide-react";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

import { HeatmapCalendar } from "./HeatmapCalendar";

import { CompletedReading } from "../../../types";
import { calculateStreak } from "../../../utils/calculateStreak";

interface ProgressStatsProps {
  completedReadings: CompletedReading[];
}

export function ProgressStats({ completedReadings }: ProgressStatsProps) {
  const uniqueDates = [...new Set(completedReadings.map((r) => r.date))].sort();
  const lastReadDate =
    uniqueDates.length > 0
      ? new Date(uniqueDates[uniqueDates.length - 1] + "T00:00:00")
      : null;
  const streak = calculateStreak(uniqueDates);
  const progress = Math.round((uniqueDates.length / 365) * 100);

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <motion.div
          layout
          className="bg-white rounded-lg border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DisclosureButton className="w-full p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-neutral-800">
                Seu Progresso
              </h2>
              <ChevronDown
                className={`w-5 h-5 text-neutral-500 transition-transform ${
                  open ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {/* Progress Section */}
            <div className="space-y-2 ">
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs">
                      {uniqueDates.length} de 365 dias
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xs text-neutral-500 text-right">
                    {progress}% concluído
                  </p>
                </div>
              </div>

              <div className="w-full bg-neutral-100 border rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full  transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </DisclosureButton>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                layout
                key="panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 space-y-4">
                  {/* Stats Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#E5E6E650] border p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Flame className="w-4 h-4" />
                        <span className="font-medium text-sm">Sequência</span>
                      </div>
                      <p className="text-lg font-semibold">{streak} dia(s)</p>
                      <p className="text-xs text-neutral-500">
                        {streak > 1
                          ? "Continue assim!"
                          : "Quantos dias seguidos você consegue?"}
                      </p>
                    </div>

                    <div className="bg-[#E5E6E650] border p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          Última Leitura
                        </span>
                      </div>
                      <p className="text-lg font-semibold">
                        {lastReadDate
                          ? format(lastReadDate, "dd/MM/yyyy")
                          : "Nenhuma"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {lastReadDate
                          ? "Mantenha a consistência"
                          : "Nada ainda? que tal começar sua primeira leitura abaixo"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h3 className="text-base font-semibold mb-2 md:mb-4">
                      Histórico de Leituras
                    </h3>
                    <div className="w-full">
                      <HeatmapCalendar completedDates={uniqueDates} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </Disclosure>
  );
}

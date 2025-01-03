import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface CompleteButtonProps {
  onComplete: () => void;
  isCompleted?: boolean;
}

export function CompleteButton({
  onComplete,
  isCompleted = false,
}: CompleteButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  // useEffect(() => {
  //   if (showConfirmDialog || showCongrats) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "unset";
  //   }

  //   return () => {
  //     document.body.style.overflow = "unset";
  //   };
  // }, [showConfirmDialog, showCongrats]);

  const playSuccessSound = () => {
    const audio = new Audio("/success.mp3");
    audio.play();
  };

  const throwConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleComplete = () => {
    console.log("Iniciando handleComplete");
    setShowConfirmDialog(false);
    onComplete();
    console.log("Chamando playSuccessSound");
    playSuccessSound();
    console.log("Chamando throwConfetti");
    throwConfetti();
    console.log("Setando showCongrats para true");
    setShowCongrats(true);
  };

  useEffect(() => {
    console.log("Estado showCongrats mudou:", showCongrats);
  }, [showCongrats]);

  if (isCompleted) {
    return (
      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center justify-center p-4 bg-emerald-50 rounded-lg border border-emerald-200"
      >
        <div className="flex items-center space-x-2 text-emerald-600">
          <Check className="w-5 h-5" />
          <span className="font-medium">Leituras do dia concluídas!</span>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => setShowConfirmDialog(true)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="w-full p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
      >
        <Check className="w-5 h-5" />
        <span>Completar Leituras do Dia</span>
      </motion.button>

      {/* Modal de Parabéns */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg max-w-sm w-full p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">🎉 Parabéns!</h3>
                <p className="text-gray-600 mb-6">
                  Você completou todas as leituras de hoje! Continue assim para
                  manter sua sequência.
                </p>
                <button
                  onClick={() => setShowCongrats(false)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Obrigado!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg max-w-sm w-full p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Confirmar conclusão</h3>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Você confirma que completou todas as leituras do dia?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

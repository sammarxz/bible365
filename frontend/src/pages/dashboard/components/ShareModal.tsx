import { X, Twitter, Instagram } from "lucide-react";

import { ShareContent } from "../../../types";

interface Props {
  content: ShareContent | null;
  onClose: () => void;
}

export function ShareModal({ content, onClose }: Props) {
  if (!content) return null;

  const shareText = `"${content.text}" - ${content.reference}`;

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const shareToInstagram = () => {
    // Como o Instagram não tem API direta para compartilhamento,
    // podemos copiar o texto para a área de transferência
    navigator.clipboard.writeText(shareText);
    alert("Texto copiado! Você pode compartilhar nos stories do Instagram.");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Compartilhar</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-700 mb-6 p-4 bg-gray-50 rounded-lg max-h-[500px] overflow-y-auto">
          {shareText}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={shareToTwitter}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-600 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span>Twitter</span>
          </button>

          <button
            onClick={shareToInstagram}
            className="flex items-center justify-center space-x-2 bg-purple-500 text-white rounded-lg p-3 hover:bg-purple-600 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span>Instagram</span>
          </button>
        </div>
      </div>
    </div>
  );
}

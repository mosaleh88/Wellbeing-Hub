import React from 'react';

interface WinModalProps {
  moves: number;
  onPlayAgain: () => void;
  lang: 'en' | 'ar';
}

const WinModal: React.FC<WinModalProps> = ({ moves, onPlayAgain, lang }) => {
  const content = {
    en: {
      title: 'Congratulations!',
      movesText: `You completed the game in`,
      movesUnit: 'moves.',
      playAgain: 'Return to Activities'
    },
    ar: {
      title: 'تهانينا!',
      movesText: `لقد أكملت اللعبة في`,
      movesUnit: 'حركة.',
      playAgain: 'العودة إلى الأنشطة'
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-4 border-emerald-300 transform scale-95 animate-modal-pop-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">{content[lang].title}</h2>
        <p className="text-lg text-gray-600 mb-8">
          {content[lang].movesText} <span className="font-bold text-indigo-600 text-xl">{moves}</span> {content[lang].movesUnit}
        </p>
        <button
          onClick={onPlayAgain}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {content[lang].playAgain}
        </button>
      </div>
    </div>
  );
};

export default WinModal;
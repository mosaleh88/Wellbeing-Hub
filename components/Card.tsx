import React from 'react';
import type { Card } from '../types';

interface CardProps {
  card: Card;
  onClick: () => void;
  isDisabled: boolean;
  lang: 'en' | 'ar';
}

const CardComponent: React.FC<CardProps> = ({ card, onClick, isDisabled, lang }) => {
  const { isFlipped, isMatched, icon, prompt } = card;

  const cardClasses = `relative w-full aspect-square transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
    isFlipped || isMatched ? '[transform:rotateY(180deg)]' : ''
  }`;
  
  const faceClasses = 'absolute w-full h-full rounded-xl shadow-lg flex items-center justify-center [backface-visibility:hidden] border-2';

  return (
    <div className="[perspective:1000px] group">
      <button 
        onClick={onClick} 
        disabled={isDisabled || isFlipped || isMatched}
        className={cardClasses}
        aria-label={`Card with icon ${icon}`}
      >
        {/* Front Face */}
        <div className={`${faceClasses} bg-white border-gray-200 hover:bg-indigo-50 transition-colors`}>
          <svg className="w-1/2 h-1/2 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Back Face */}
        <div className={`${faceClasses} [transform:rotateY(180deg)] flex-col p-2 sm:p-3 text-center ${isMatched ? 'bg-emerald-400 border-emerald-500' : 'bg-indigo-400 border-indigo-500'}`}>
          <div className={`text-4xl sm:text-5xl transition-all duration-300 ${isMatched ? 'scale-110 mb-2' : ''}`}>{icon}</div>
          {isMatched && (
            <p dir="auto" className="text-xs sm:text-sm font-semibold text-white animate-fade-in">
              {prompt[lang]}
            </p>
          )}
        </div>
      </button>
    </div>
  );
};

export default CardComponent;
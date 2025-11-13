import React, { useState, useEffect } from 'react';
import CardComponent from './Card';
import WinModal from './WinModal';
import QuestionModal from './QuestionModal';
import type { Card, CardContent, StudentInfo, MemoryAnswer } from '../types';
import useSounds from '../hooks/useSounds';

interface GameResult {
  moves: number;
  answers: MemoryAnswer[];
}

interface Props {
  cards: CardContent[];
  onComplete: (result: GameResult) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

const Game: React.FC<Props> = ({ cards: cardContent, onComplete, lang, studentInfo }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Card | null>(null);
  const [reflectionAnswers, setReflectionAnswers] = useState<MemoryAnswer[]>([]);
  const { playFlipSound, playMatchSound, playNoMatchSound, playWinSound } = useSounds();

  const shuffleAndDealCards = () => {
    if (!cardContent || cardContent.length === 0) return;
    const duplicatedCards = [...cardContent, ...cardContent];
    const shuffled = duplicatedCards.sort(() => 0.5 - Math.random());
    setCards(shuffled.map((card, index) => ({
      ...card,
      instanceId: index,
      isFlipped: false,
      isMatched: false,
    })));
    setMoves(0);
    setFlippedCards([]);
    setIsGameWon(false);
    setReflectionAnswers([]);
  };

  useEffect(() => {
    shuffleAndDealCards();
  }, [cardContent]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves => moves + 1);
      const [firstCardIndex, secondCardIndex] = flippedCards;
      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];

      if (firstCard.pairId === secondCard.pairId) {
        // Match
        playMatchSound();
        setTimeout(() => {
          setCurrentQuestion(firstCard);
          setIsQuestionModalOpen(true);
        }, 500);
      } else {
        // No match
        playNoMatchSound();
        setTimeout(() => {
          setCards(prevCards => prevCards.map((card, index) => 
            index === firstCardIndex || index === secondCardIndex ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  }, [flippedCards, cards, playMatchSound, playNoMatchSound]);
  
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      playWinSound();
      setIsGameWon(true);
    }
  }, [cards, playWinSound]);

  const handleCardClick = (index: number) => {
    if (isChecking || isQuestionModalOpen || flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }
    playFlipSound();
    setCards(prevCards => prevCards.map((card, i) => i === index ? { ...card, isFlipped: true } : card));
    setFlippedCards([...flippedCards, index]);
  };

  const handleQuestionSubmit = (answer: string) => {
    if (currentQuestion) {
      setReflectionAnswers(prev => [...prev, { prompt: currentQuestion.prompt, answer }]);
      
      setCards(prevCards => prevCards.map(card =>
        card.pairId === currentQuestion.pairId ? { ...card, isMatched: true } : card
      ));
    }
    setIsQuestionModalOpen(false);
    setCurrentQuestion(null);
    setFlippedCards([]);
    setIsChecking(false);
  };

  const handleEndGame = () => {
    onComplete({ moves, answers: reflectionAnswers });
  };

  const content = {
      en: { title: "Reflection Match", back: "Back to Activities", moves: "Moves", welcome: "Player" },
      ar: { title: "تطابق التأمل", back: "العودة إلى الأنشطة", moves: "حركات", welcome: "لاعب" }
  };
  
  if (!cardContent || cardContent.length === 0) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600">No Cards Available</h2>
            <p className="text-gray-600 mt-2">Please ask a counsellor to configure the cards in the admin panel.</p>
            <button onClick={() => onComplete({ moves: 0, answers: [] })} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                {content[lang].back}
            </button>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 text-center">
        <div className="flex justify-between items-center mb-6">
            <button onClick={handleEndGame} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
              &larr; {content[lang].back}
            </button>
            <div className="text-lg font-semibold text-gray-600">{studentInfo?.name}</div>
        </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">{content[lang].title}</h1>
      <p className="text-lg mb-8 text-gray-500">{content[lang].moves}: <span className="font-bold text-indigo-600">{moves}</span></p>
      
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
        {cards.map((card) => (
          <CardComponent 
            key={card.instanceId}
            card={card}
            onClick={() => handleCardClick(card.instanceId)}
            isDisabled={isChecking || isQuestionModalOpen}
            lang={lang}
          />
        ))}
      </div>
      
      {isGameWon && <WinModal moves={moves} onPlayAgain={handleEndGame} lang={lang}/>}
      
      {isQuestionModalOpen && currentQuestion && (
        <QuestionModal 
          prompt={currentQuestion.prompt[lang]}
          onSubmit={handleQuestionSubmit}
          lang={lang}
        />
      )}
    </div>
  );
};

export default Game;
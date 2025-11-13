import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { StudentInfo, MindSnakeQuestion, MindSnakeResult, LocalizedString } from '../types';

interface Props {
  questions: MindSnakeQuestion[];
  onComplete: (result: MindSnakeResult) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

// Game constants
const GRID_SIZE = 20;
const TILE_SIZE = 20;
const CANVAS_WIDTH = GRID_SIZE * TILE_SIZE;
const CANVAS_HEIGHT = GRID_SIZE * TILE_SIZE;
const GAME_SPEED = 150; // ms per tick

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameStatus = 'pre-start' | 'running' | 'question' | 'game-over';
type SnakeSegment = { x: number; y: number };

const MindSnake: React.FC<Props> = ({ questions, onComplete, lang, studentInfo }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix: Initialize useRef with a value to prevent errors.
  const gameLoopRef = useRef(0);

  const [gameStatus, setGameStatus] = useState<GameStatus>('pre-start');
  const [snake, setSnake] = useState<SnakeSegment[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<MindSnakeQuestion & { x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<MindSnakeQuestion | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<{ question: LocalizedString; answer: string }[]>([]);

  const content = {
    en: {
      title: "Mind Snake",
      score: "Score",
      start: "Start Game",
      instructions: "Use arrow keys to move. Answer questions to grow!",
      gameOver: "Game Over",
      playAgain: "Play Again",
      finish: "Finish Activity",
      submit: "Submit",
      back: "Back",
    },
    ar: {
      title: "ثعبان العقل",
      score: "النتيجة",
      start: "ابدأ اللعبة",
      instructions: "استخدم أسهم لوحة المفاتيح للحركة. أجب عن الأسئلة لتنمو!",
      gameOver: "انتهت اللعبة",
      playAgain: "العب مرة أخرى",
      finish: "إنهاء النشاط",
      submit: "إرسال",
      back: "رجوع",
    },
  };

  const getRandomPosition = useCallback((currentSnake: SnakeSegment[]) => {
    let position;
    do {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
  }, []);

  const placeFood = useCallback((currentSnake: SnakeSegment[]) => {
    if (questions.length === 0) return;
    const question = questions[Math.floor(Math.random() * questions.length)];
    const position = getRandomPosition(currentSnake);
    setFood({ ...question, ...position });
  }, [questions, getRandomPosition]);
  
  const resetGame = useCallback(() => {
    const startSnake = [{ x: 10, y: 10 }];
    setSnake(startSnake);
    setDirection('RIGHT');
    setScore(0);
    setAnswers([]);
    setCurrentAnswer('');
    placeFood(startSnake);
    setGameStatus('running');
  }, [placeFood]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    setDirection(prev => {
        if (key === 'ArrowUp' && prev !== 'DOWN') return 'UP';
        if (key === 'ArrowDown' && prev !== 'UP') return 'DOWN';
        if (key === 'ArrowLeft' && prev !== 'RIGHT') return 'LEFT';
        if (key === 'ArrowRight' && prev !== 'LEFT') return 'RIGHT';
        return prev;
    });
  };
  
  useEffect(() => {
    if (gameStatus === 'running') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameStatus]);

  const gameTick = useCallback(() => {
    if (gameStatus !== 'running') return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }
      
      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameStatus('game-over');
        return prevSnake;
      }
      
      // Self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setGameStatus('game-over');
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Food collision
      if (food && head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        setCurrentQuestion(food);
        setGameStatus('question');
        placeFood(newSnake);
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [direction, food, gameStatus, placeFood]);

  useEffect(() => {
    if (gameStatus === 'running') {
      gameLoopRef.current = window.setInterval(gameTick, GAME_SPEED);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStatus, gameTick]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#E0F7FA'; // Light blue background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw food
    if (food) {
      ctx.font = `${TILE_SIZE * 1.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(food.icon, food.x * TILE_SIZE + TILE_SIZE / 2, food.y * TILE_SIZE + TILE_SIZE / 2);
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#FF5722' : '#FF8A65'; // Orange head, lighter orange body
      ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

  }, [snake, food]);

  const handleQuestionSubmit = () => {
    if (currentQuestion) {
        setAnswers(prev => [...prev, { question: currentQuestion.prompt, answer: currentAnswer }]);
        setCurrentQuestion(null);
        setCurrentAnswer('');
        setGameStatus('running');
    }
  };

  const handleFinish = () => {
    const result: MindSnakeResult = { score, answers };
    onComplete(result);
  };
  
  if (questions.length === 0) {
    return <div>No questions available. Please configure them in the admin panel.</div>
  }
  
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handleFinish} className="bg-[#74836e] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#a19988]">{content[lang].back}</button>
        <div className="text-lg font-semibold text-[#5c7078]">{studentInfo?.name}</div>
      </div>
      <h1 className="text-4xl font-bold text-[#458489] mb-2">{content[lang].title}</h1>
      <p className="text-xl font-semibold text-[#5c7078] mb-4">{content[lang].score}: {score}</p>

      <div className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, margin: '0 auto' }}>
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-blue-100 border-4 border-[#a0b2be] rounded-lg shadow-inner"></canvas>
          
          {gameStatus !== 'running' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg text-white p-4">
              {gameStatus === 'pre-start' && (
                <>
                  <h2 className="text-3xl font-bold mb-4">{content[lang].title}</h2>
                  <p className="mb-6">{content[lang].instructions}</p>
                  <button onClick={resetGame} className="bg-[#a19988] hover:bg-[#74836e] font-bold py-3 px-8 rounded-lg text-lg animate-pulse">{content[lang].start}</button>
                </>
              )}
              {gameStatus === 'game-over' && (
                 <>
                  <h2 className="text-3xl font-bold mb-4">{content[lang].gameOver}</h2>
                  <p className="mb-6 text-xl">{content[lang].score}: {score}</p>
                  <div className="flex gap-4">
                     <button onClick={resetGame} className="bg-[#a19988] hover:bg-[#74836e] font-bold py-2 px-6 rounded-lg">{content[lang].playAgain}</button>
                     <button onClick={handleFinish} className="bg-[#458489] hover:bg-[#74836e] font-bold py-2 px-6 rounded-lg">{content[lang].finish}</button>
                  </div>
                </>
              )}
              {gameStatus === 'question' && currentQuestion && (
                 <div className="w-full bg-white text-[#2d3748] p-6 rounded-lg shadow-xl animate-fade-in">
                    <div className="text-5xl mb-2">{currentQuestion.icon}</div>
                    <p className="font-semibold mb-4" dir="auto">{currentQuestion.prompt[lang]}</p>
                    <textarea 
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        className="w-full p-2 border rounded text-black"
                        rows={3}
                        dir="auto"
                    />
                    <button onClick={handleQuestionSubmit} disabled={!currentAnswer.trim()} className="mt-4 bg-[#458489] hover:bg-[#74836e] text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400">
                        {content[lang].submit}
                    </button>
                 </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default MindSnake;

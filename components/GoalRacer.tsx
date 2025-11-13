import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { StudentInfo, GoalRacerCheckpoint, GoalRacerResult, LocalizedString } from '../types';

interface Props {
  checkpoints: GoalRacerCheckpoint[];
  onComplete: (result: GoalRacerResult) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

interface GameObject {
  id: number;
  type: 'obstacle' | 'booster';
  icon: string;
  x: number; // position percentage from left (0-100)
  y: number; // position percentage from top (0-100)
}

const CAR_WIDTH_PERC = 12;
const ITEM_WIDTH_PERC = 10;
const CAR_Y_PERC = 85;

// Physics constants for smoother movement
const CAR_ACCELERATION = 0.4;
const CAR_FRICTION = 0.92;
const MAX_VELOCITY = 4.0;

const GoalRacer: React.FC<Props> = ({ checkpoints, onComplete, lang, studentInfo }) => {
  const validCheckpoints = useMemo(() => checkpoints?.filter(cp => cp && cp.question) || [], [checkpoints]);

  const [gameStatus, setGameStatus] = useState<'pre-start' | 'running' | 'question'>('pre-start');
  const [carPosition, setCarPosition] = useState(50); // 0-100 for left/right on track
  const [temporarySpeedModifier, setTemporarySpeedModifier] = useState(1);
  const [scores, setScores] = useState({ focusLevel: 0, effortBoost: 0, growthPoints: 0 });
  const [items, setItems] = useState<GameObject[]>([]);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: LocalizedString, answer: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isInvincible, setIsInvincible] = useState(false);

  const gameLoopRef = useRef(0);
  const lastTickRef = useRef(performance.now());
  const nextItemSpawnTimeRef = useRef(0);
  const speedModifierTimeoutRef = useRef<number | null>(null);
  const invincibilityTimeoutRef = useRef<number | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const carVelocity = useRef(0);

  const content = {
      en: { 
        title: "Goal Racer", 
        back: "End Race", 
        submit: "Submit & Boost!", 
        welcome: "Player", 
        start: "Start Race", 
        instructions: "Use Arrow Keys to Dodge 🚧 and Collect ⚡️!",
        speed: "Speed", 
        growth: "Growth",
        pitStop: "Crash!",
        pitStopMessage: "You hit an obstacle! Time for a mindful pit stop to reflect and recharge.",
      },
      ar: { 
        title: "متسابق الأهداف", 
        back: "إنهاء السباق", 
        submit: "إرسال وتعزيز!", 
        welcome: "لاعب", 
        start: "ابدأ السباق", 
        instructions: "استخدم أسهم لوحة المفاتيح لتفادي 🚧 وجمع ⚡️!",
        speed: "السرعة", 
        growth: "النمو",
        pitStop: "اصطدام!",
        pitStopMessage: "لقد اصطدمت بعائق! حان وقت التوقف للتأمل وإعادة الشحن.",
      }
  };
  
  const currentSpeedRaw = (1 + scores.effortBoost / 50) * temporarySpeedModifier;
  const currentSpeed = Math.min(currentSpeedRaw, 4.0);

  const gameTick = useCallback(() => {
    const now = performance.now();
    const delta = (now - lastTickRef.current) / 16.67; // Normalize to 60fps
    lastTickRef.current = now;

    if (gameStatus !== 'running') return;

    // --- Car Physics & Movement ---
    let currentVelocity = carVelocity.current;
    if (keysPressed.current['ArrowLeft']) {
      currentVelocity -= CAR_ACCELERATION;
    }
    if (keysPressed.current['ArrowRight']) {
      currentVelocity += CAR_ACCELERATION;
    }

    currentVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, currentVelocity));
    currentVelocity *= CAR_FRICTION; // Apply friction

    if (Math.abs(currentVelocity) < 0.01) {
      currentVelocity = 0;
    }
    carVelocity.current = currentVelocity;
    
    let newCarPosition = carPosition + (currentVelocity * delta);
    newCarPosition = Math.max(15, Math.min(85, newCarPosition));
    setCarPosition(newCarPosition);

    // --- Item Spawning & Collision ---
    setItems(prevItems => {
        let newItems = prevItems
            .map(item => ({...item, y: item.y + currentSpeed * 0.4 * delta}))
            .filter(item => item.y < 105);

        const carLeft = newCarPosition - (CAR_WIDTH_PERC / 2);
        const carRight = newCarPosition + (CAR_WIDTH_PERC / 2);

        let shouldBreak = false;
        for (const item of newItems) {
            if (item.y > CAR_Y_PERC - 10 && item.y < CAR_Y_PERC + 5) {
                const itemLeft = item.x - (ITEM_WIDTH_PERC / 2);
                const itemRight = item.x + (ITEM_WIDTH_PERC / 2);

                if (Math.max(carLeft, itemLeft) < Math.min(carRight, itemRight)) {
                    if (item.type === 'booster') {
                        setScores(s => ({ ...s, effortBoost: s.effortBoost + 10 }));
                        newItems = newItems.filter(i => i.id !== item.id);
                        shouldBreak = true;
                    } else if (!isInvincible) { // Obstacle collision
                        setTemporarySpeedModifier(0.3);
                        if(speedModifierTimeoutRef.current) clearTimeout(speedModifierTimeoutRef.current);
                        speedModifierTimeoutRef.current = window.setTimeout(() => setTemporarySpeedModifier(1), 1500);

                        setIsShaking(true);
                        setTimeout(() => setIsShaking(false), 500);

                        if (validCheckpoints.length > 0) {
                            setGameStatus('question');
                        }
                        newItems = newItems.filter(i => i.id !== item.id);
                        shouldBreak = true;
                    }
                    if (shouldBreak) break;
                }
            }
        }
        
        if (now > nextItemSpawnTimeRef.current) {
            nextItemSpawnTimeRef.current = now + 1200 / currentSpeed;
            const type = Math.random() > 0.6 ? 'booster' : 'obstacle';
            newItems.push({
                id: now,
                type: type,
                icon: type === 'booster' ? '⚡️' : '🚧',
                x: Math.random() * 70 + 15, // from 15% to 85%
                y: -5,
            });
        }
        
        return newItems;
    });
  }, [gameStatus, currentSpeed, carPosition, validCheckpoints.length, isInvincible]);

  useEffect(() => {
    lastTickRef.current = performance.now();
    const loop = () => {
      gameTick();
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameTick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            keysPressed.current[e.key] = true;
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            keysPressed.current[e.key] = false;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleQuestionSubmit = () => {
    const currentCheckpoint = validCheckpoints[currentCheckpointIndex];
    if (!currentCheckpoint || currentAnswer.trim() === '') return;
    
    setScores(s => ({
        focusLevel: s.focusLevel + 10,
        effortBoost: s.effortBoost + 15,
        growthPoints: s.growthPoints + 20,
    }));
    setAnswers(a => [...a, { question: currentCheckpoint.question, answer: currentAnswer }]);
    
    if(speedModifierTimeoutRef.current) clearTimeout(speedModifierTimeoutRef.current);
    setTemporarySpeedModifier(2.5);
    speedModifierTimeoutRef.current = window.setTimeout(() => setTemporarySpeedModifier(1), 2000);
    
    setIsInvincible(true);
    if(invincibilityTimeoutRef.current) clearTimeout(invincibilityTimeoutRef.current);
    invincibilityTimeoutRef.current = window.setTimeout(() => setIsInvincible(false), 3000);
    
    setCurrentAnswer('');
    setCurrentCheckpointIndex(i => (i + 1) % validCheckpoints.length);
    setGameStatus('running');
  };
  
  const handleEndRace = () => {
      const result: GoalRacerResult = { ...scores, answers };
      onComplete(result);
  }

  const currentQuestion = validCheckpoints && validCheckpoints.length > 0 ? validCheckpoints[currentCheckpointIndex] : null;
  const roadAnimationDuration = currentSpeed > 0.2 ? 1 / currentSpeed : 5;
  
  return (
    <div className={`max-w-xl mx-auto ${isShaking ? 'animate-shake' : ''}`}>
        <div className="flex justify-between items-center mb-4 px-2">
            <button onClick={handleEndRace} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">&larr; {content[lang].back}</button>
            <h1 className="text-3xl font-bold text-gray-800 tracking-wider">{content[lang].title}</h1>
            <div className="text-md font-semibold text-gray-600 hidden sm:block">{studentInfo?.name}</div>
        </div>

        <div className="flex justify-around mb-4 p-3 rounded-xl text-center bg-white shadow-md border border-gray-200">
            <div className="font-semibold text-gray-700"><span className="text-gray-500">{content[lang].speed}:</span> x{currentSpeed.toFixed(1)}</div>
            <div className="font-semibold text-gray-700"><span className="text-gray-500">{content[lang].growth}:</span> {scores.growthPoints}</div>
        </div>

        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-800 shadow-inner perspective-300">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-gray-100 transform-gpu rotate-x-20 origin-bottom">
                 {/* Road Lines */}
                <div className="absolute left-1/3 top-0 w-1 h-full bg-white/30"></div>
                <div className="absolute left-2/3 top-0 w-1 h-full bg-white/30"></div>
                <div 
                    className="absolute inset-0 bg-repeat-y bg-center"
                    style={{
                        backgroundImage: 'linear-gradient(white 50%, transparent 50%)',
                        backgroundSize: '4px 40px',
                        animation: `move-lines ${roadAnimationDuration}s linear infinite`
                    }}
                ></div>
                
                {/* Items */}
                {items.map(item => {
                    const scale = 0.5 + (item.y / 100) * 1.5;
                    return (
                        <div key={item.id} className="absolute text-2xl sm:text-4xl" style={{ 
                            top: `${item.y}%`, 
                            left: `${item.x}%`, 
                            transform: `translateX(-50%) scale(${scale})` 
                        }}>{item.icon}</div>
                    );
                })}

                 {/* Car */}
                <div 
                    className={`absolute text-5xl transition-opacity duration-200 ${isInvincible ? 'opacity-50 animate-pulse' : 'opacity-100'}`}
                    style={{ 
                        left: `${carPosition}%`, 
                        bottom: `${100 - CAR_Y_PERC}%`,
                        transform: 'translateX(-50%)'
                    }}>
                    🏎️
                </div>
            </div>
        </div>
        
        {(gameStatus !== 'running') && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30 animate-fade-in p-4">
                <div className="p-8 bg-white rounded-2xl shadow-2xl text-center max-w-lg w-full border-4 border-indigo-200">
                    {gameStatus === 'pre-start' && (
                        <>
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">{content[lang].title}</h2>
                            <p className="text-lg text-gray-600 mb-8">{content[lang].instructions}</p>
                            <button onClick={() => setGameStatus('running')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 animate-pulse">
                                {content[lang].start}
                            </button>
                        </>
                    )}
                    {(gameStatus === 'question' && currentQuestion) && (
                         <>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">💥 {content[lang].pitStop} 💥</h2>
                            <p className="text-md text-gray-600 mb-4">{content[lang].pitStopMessage}</p>
                            <p className="text-lg font-semibold text-gray-700 mb-4" dir="auto">{currentQuestion.question[lang]}</p>
                            <textarea 
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-100 border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                rows={3}
                                dir="auto"
                            />
                            <button 
                              onClick={handleQuestionSubmit} 
                              disabled={currentAnswer.trim() === ''}
                              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {content[lang].submit}
                            </button>
                         </>
                    )}
                </div>
            </div>
        )}
        
        <style>{`
            .perspective-300 {
                perspective: 300px;
            }
            .rotate-x-20 {
                transform: rotateX(20deg);
            }
            @keyframes move-lines {
                from { background-position-y: 0; }
                to { background-position-y: -40px; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .animate-shake {
                animation: shake 0.5s ease-in-out;
            }
        `}</style>
    </div>
  );
};

export default GoalRacer;
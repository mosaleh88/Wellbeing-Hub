import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { StudentInfo, RunOfChoicesMilestone, RunOfChoicesResult, LocalizedString } from '../types';

interface Props {
  milestones: RunOfChoicesMilestone[];
  onComplete: (result: RunOfChoicesResult) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

interface GameObject {
  id: number;
  type: 'obstacle_low' | 'obstacle_high' | 'point';
  icon: string;
  lane: number; // -1 (left), 0 (center), 1 (right)
  y: number; // position percentage from top (0-100)
}

const PLAYER_Y_PERC = 80;
const GAME_SPEED_INITIAL = 0.5;
const GAME_SPEED_INCREMENT = 0.0001;
const GRAVITY = 0.65; // Lowered for more hang time
const JUMP_FORCE = 16; // Slightly increased for better feel
const LOW_OBSTACLE_JUMP_CLEARANCE = 15; // Lowered for more forgiving jumps

const RunOfChoices: React.FC<Props> = ({ milestones, onComplete, lang, studentInfo }) => {
  const [gameStatus, setGameStatus] = useState<'pre-start' | 'running' | 'question' | 'game-over'>('pre-start');
  const [playerLane, setPlayerLane] = useState(0); // -1, 0, 1
  const [playerY, setPlayerY] = useState(0); // vertical position in px
  const [playerVisualState, setPlayerVisualState] = useState<'running' | 'jumping' | 'ducking' | 'hit'>('running');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [items, setItems] = useState<GameObject[]>([]);
  const [currentMilestone, setCurrentMilestone] = useState<RunOfChoicesMilestone | null>(null);
  const [answers, setAnswers] = useState<{ question: LocalizedString; answer: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const gameLoopRef = useRef<number>(0);
  const lastTickRef = useRef(performance.now());
  const nextItemSpawnTimeRef = useRef(0);
  const playerVy = useRef(0);
  
  const sortedMilestones = useMemo(() => [...milestones].sort((a, b) => a.distance - b.distance), [milestones]);

  const content = {
      en: { 
        title: "Run of Choices", 
        back: "End Run", 
        submit: "Submit & Continue", 
        welcome: "Player", 
        start: "Start Running", 
        instructions: "Arrows to move, Space to Jump, Down Arrow to Duck!",
        score: "Focus Points", 
        distance: "Distance",
        milestone: "Milestone Reached!",
        gameOver: "Game Over",
        playAgain: "Run Again",
      },
      ar: { 
        title: "ركضة الخيارات", 
        back: "إنهاء الركض", 
        submit: "إرسال ومتابعة", 
        welcome: "لاعب", 
        start: "ابدأ الركض", 
        instructions: "الأسهم للحركة, المسطرة للقفز, السهم للأسفل للانحناء!",
        score: "نقاط التركيز", 
        distance: "المسافة",
        milestone: "تم الوصول إلى مرحلة!",
        gameOver: "انتهت اللعبة",
        playAgain: "اركض مجدداً",
      }
  };
  
  const currentSpeed = GAME_SPEED_INITIAL + distance * GAME_SPEED_INCREMENT;
  const roadAnimationDuration = 1 / currentSpeed;

  const gameTick = useCallback(() => {
    const now = performance.now();
    const delta = (now - lastTickRef.current) / 16.67; // Normalize to 60fps
    lastTickRef.current = now;

    if (gameStatus !== 'running') return;
    
    // Player vertical physics for jumping
    if (playerVisualState !== 'ducking') {
        let newPlayerY = playerY;
        if (playerVy.current !== 0 || newPlayerY > 0) {
            playerVy.current -= GRAVITY * delta;
            newPlayerY += playerVy.current * delta;
            if (newPlayerY <= 0) {
                newPlayerY = 0;
                playerVy.current = 0;
                if (playerVisualState === 'jumping') setPlayerVisualState('running');
            }
            setPlayerY(newPlayerY);
        }
    }
    
    const newDistance = distance + currentSpeed * delta;
    setDistance(newDistance);
    
    const nextMilestone = sortedMilestones.find(m => newDistance >= m.distance && !answers.some(a => a.question.en === m.prompt.en));
    if (nextMilestone) {
        setGameStatus('question');
        setCurrentMilestone(nextMilestone);
    }

    setItems(prevItems => {
        let newItems = prevItems
            .map(item => ({...item, y: item.y + currentSpeed * delta}))
            .filter(item => item.y < 105);

        let shouldEndGame = false;
        for (const item of newItems) {
            if (item.y > PLAYER_Y_PERC - 5 && item.y < PLAYER_Y_PERC + 5 && item.lane === playerLane) {
                if (item.type === 'point') {
                    setScore(s => s + 10);
                    newItems = newItems.filter(i => i.id !== item.id);
                } else if (item.type === 'obstacle_low' && playerY <= LOW_OBSTACLE_JUMP_CLEARANCE) {
                    shouldEndGame = true;
                    break;
                } else if (item.type === 'obstacle_high' && playerVisualState !== 'ducking') {
                    shouldEndGame = true;
                    break;
                }
            }
        }
        
        if (shouldEndGame) {
          setGameStatus('game-over');
          setPlayerVisualState('hit');
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          return prevItems;
        }
        
        if (now > nextItemSpawnTimeRef.current) {
            nextItemSpawnTimeRef.current = now + (1200 / (currentSpeed * 1.5));
            const type = Math.random() > 0.45 ? (Math.random() > 0.5 ? 'obstacle_low' : 'obstacle_high') : 'point';
            const lane = Math.floor(Math.random() * 3) - 1;
            newItems.push({
                id: now,
                type: type,
                icon: type === 'point' ? '💡' : type === 'obstacle_low' ? '🚧' : '',
                lane,
                y: -10,
            });
        }
        
        return newItems;
    });
  }, [gameStatus, currentSpeed, playerLane, distance, sortedMilestones, answers, playerY, playerVisualState]);

  const handleEndRun = () => {
      const result: RunOfChoicesResult = { score, distance: Math.floor(distance), answers };
      onComplete(result);
  }

  const resetGame = useCallback(() => {
    setGameStatus('running');
    setPlayerLane(0);
    setPlayerY(0);
    playerVy.current = 0;
    setPlayerVisualState('running');
    setScore(0);
    setDistance(0);
    setItems([]);
    setAnswers([]);
    setCurrentMilestone(null);
    setCurrentAnswer('');
    lastTickRef.current = performance.now();
    nextItemSpawnTimeRef.current = performance.now() + 1000;
  }, []);

  useEffect(() => {
    if (gameStatus === 'running') {
        const loop = () => {
          gameTick();
          gameLoopRef.current = requestAnimationFrame(loop);
        };
        gameLoopRef.current = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameStatus, gameTick]);
  
   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'running') return;
      
      const key = e.key;
      if (key === 'ArrowLeft') {
        e.preventDefault();
        setPlayerLane(p => Math.max(-1, p - 1));
      } else if (key === 'ArrowRight') {
        e.preventDefault();
        setPlayerLane(p => Math.min(1, p + 1));
      } else if (key === ' ' || key === 'Spacebar' || key === 'ArrowUp') {
        e.preventDefault();
        if (playerY <= 0 && playerVisualState !== 'ducking') {
            playerVy.current = JUMP_FORCE;
            setPlayerVisualState('jumping');
        }
      } else if (key === 'ArrowDown') {
        e.preventDefault();
        if (playerY <= 0) { // Can't duck in the air
            setPlayerVisualState('ducking');
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (gameStatus !== 'running') return;
        if (e.key === 'ArrowDown' && playerVisualState === 'ducking') {
            setPlayerVisualState('running');
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStatus, playerY, playerVisualState]);

  const handleQuestionSubmit = () => {
    if (!currentMilestone || currentAnswer.trim() === '') return;
    setAnswers(a => [...a, { question: currentMilestone.prompt, answer: currentAnswer }]);
    setCurrentAnswer('');
    setCurrentMilestone(null);
    setGameStatus('running');
    lastTickRef.current = performance.now();
  };

  const laneToPercentage = (lane: number) => 50 + lane * 25;

  return (
    <div className={`max-w-md mx-auto p-4 bg-white text-gray-800 rounded-2xl shadow-2xl font-sans relative overflow-hidden ${isShaking ? 'animate-shake' : ''}`}>
        <div className="flex justify-between items-center mb-4 px-2 relative z-20">
            <button onClick={handleEndRun} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-colors">{content[lang].back}</button>
            <h1 className="text-3xl font-bold text-[#0077b6] tracking-wider">{content[lang].title}</h1>
            <div className="text-sm hidden sm:block">{studentInfo?.name}</div>
        </div>

        <div className="flex justify-around mb-2 p-2 rounded-lg text-center bg-[#0077b6] text-white relative z-20">
            <div><span className="opacity-80">{content[lang].score}:</span> {score}</div>
            <div><span className="opacity-80">{content[lang].distance}:</span> {Math.floor(distance)}m</div>
        </div>

        <div className="game-viewport-choices">
            <div className="road-choices" style={{'--road-animation-duration': `${roadAnimationDuration}s`} as React.CSSProperties}>
                <div className="road-lines-choices"></div>
            
                {items.map(item => {
                    const scale = 0.2 + (item.y / 100) * 1.5;
                    const xPos = laneToPercentage(item.lane);
                    if (item.type === 'obstacle_high') {
                      return (
                        <div key={item.id} className="obstacle-high" style={{ 
                            top: `${item.y}%`, 
                            left: `${xPos}%`, 
                            transform: `translateX(-50%) scale(${scale})` 
                        }}></div>
                      )
                    }
                    return (
                        <div key={item.id} className={`absolute text-3xl sm:text-4xl ${item.type === 'point' ? 'item-point' : ''}`} style={{ 
                            top: `${item.y}%`, 
                            left: `${xPos}%`, 
                            transform: `translateX(-50%) scale(${scale})` 
                        }}>{item.icon}</div>
                    );
                })}
                
                <div 
                  className={`player-container`} 
                  style={{ 
                      left: `${laneToPercentage(playerLane)}%`,
                      bottom: `calc(${100 - PLAYER_Y_PERC}% + ${playerY}px)` 
                  }}>
                    <div className="player-shadow"></div>
                    <div className={`player-character ${playerVisualState}`}>
                      <div className="player-head"></div>
                      <div className="player-torso"></div>
                      <div className="player-arm arm-left"></div>
                      <div className="player-arm arm-right"></div>
                      <div className="player-leg leg-left"></div>
                      <div className="player-leg leg-right"></div>
                    </div>
                </div>
            </div>
        </div>
        
        {(gameStatus !== 'running') && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-30 animate-fade-in p-4 text-center">
                <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg border-2 border-[#00b4d8]">
                    {gameStatus === 'pre-start' && (
                        <>
                            <h2 className="text-4xl font-bold text-[#0077b6] mb-4">{content[lang].title}</h2>
                            <p className="text-lg text-gray-700 mb-6">{content[lang].instructions}</p>
                            <button onClick={resetGame} className="bg-[#fb8500] hover:bg-[#ffb703] text-white font-bold py-3 px-8 rounded text-xl animate-pulse">
                                {content[lang].start}
                            </button>
                        </>
                    )}
                     {gameStatus === 'game-over' && (
                        <>
                            <h2 className="text-4xl font-bold text-red-500 mb-2">{content[lang].gameOver}</h2>
                            <p className="text-lg text-gray-700">{content[lang].score}: {score}</p>
                            <p className="text-lg text-gray-700 mb-6">{content[lang].distance}: {Math.floor(distance)}m</p>
                            <div className="flex justify-center gap-4">
                               <button onClick={resetGame} className="bg-[#fb8500] hover:bg-[#ffb703] text-white font-bold py-2 px-6 rounded-lg">
                                  {content[lang].playAgain}
                                </button>
                                <button onClick={handleEndRun} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg">
                                  {content[lang].back}
                                </button>
                            </div>
                        </>
                    )}
                    {(gameStatus === 'question' && currentMilestone) && (
                        <>
                            <h2 className="text-2xl font-bold text-[#0077b6] mb-2">{content[lang].milestone}</h2>
                            <p className="text-lg mb-4 text-gray-800" dir="auto">{currentMilestone.prompt[lang]}</p>
                            <textarea 
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-black focus:ring-2 focus:ring-[#fb8500]"
                                rows={3}
                                dir="auto"
                            />
                            <button 
                              onClick={handleQuestionSubmit} 
                              disabled={currentAnswer.trim() === ''}
                              className="mt-4 bg-[#fb8500] hover:bg-[#ffb703] text-white font-bold py-2 px-6 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {content[lang].submit}
                            </button>
                        </>
                    )}
                </div>
            </div>
        )}
        
        <style>{`
            .game-viewport-choices {
                height: 500px;
                border-radius: 0.5rem;
                overflow: hidden;
                position: relative;
                background: linear-gradient(to bottom, #ade8f4, #48cae4);
                perspective: 300px;
            }
            .road-choices {
                position: absolute;
                width: 100%;
                height: 100%;
                background: #90e0ef;
                transform-style: preserve-3d;
                transform: rotateX(15deg);
                display: flex;
                justify-content: center;
            }
            .road-choices::before, .road-choices::after {
                content: '';
                position: absolute;
                width: 15%;
                height: 100%;
                background: #00b4d8;
            }
            .road-choices::before { left: 0; }
            .road-choices::after { right: 0; }
            
            .road-lines-choices {
                position: absolute;
                left: 50%;
                width: 50%;
                height: 100%;
                transform: translateX(-50%);
                overflow: hidden;
                border-left: 5px dashed white;
                border-right: 5px dashed white;
            }
             .road-lines-choices::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 200%;
                top: -100%;
                background: repeating-linear-gradient(to bottom, transparent 0, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 80px);
                animation: move-lines-choices linear infinite var(--road-animation-duration);
            }
            @keyframes move-lines-choices {
                from { transform: translateY(0); }
                to { transform: translateY(80px); }
            }
            @keyframes shake-horizontal {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .animate-shake {
                animation: shake-horizontal 0.5s ease-in-out;
            }

            .player-container {
                position: absolute;
                width: 50px;
                height: 60px;
                transform: translateX(-50%);
                z-index: 10;
                transition: left 0.1s ease-out;
            }
            .player-shadow {
                position: absolute;
                bottom: -5px;
                left: 50%;
                width: 80%;
                height: 5px;
                background: rgba(0,0,0,0.2);
                border-radius: 50%;
                transform: translateX(-50%) scaleX(0.8);
                transition: transform 0.2s ease-out, bottom 0.2s ease-out;
            }
            .player-container.jumping .player-shadow {
                transform: translateX(-50%) scaleX(0.4);
                bottom: -15px;
            }
            
            .player-character {
              position: absolute;
              width: 100%;
              height: 100%;
              transform-origin: bottom;
            }
            .player-head { position: absolute; top: 0; left: 30%; width: 40%; height: 25%; background: #ffb703; border-radius: 50%; }
            .player-torso { position: absolute; top: 25%; left: 25%; width: 50%; height: 45%; background: #fb8500; border-radius: 10px 10px 0 0; }
            .player-arm { position: absolute; top: 30%; left: 10%; width: 15%; height: 40%; background: #fb8500; border-radius: 5px; transform-origin: top; }
            .player-arm.arm-right { left: 75%; }
            .player-leg { position: absolute; top: 70%; left: 25%; width: 20%; height: 30%; background: #0077b6; border-radius: 0 0 5px 5px; transform-origin: top; }
            .player-leg.leg-right { left: 55%; }
            
            .player-character.running { animation: player-run 0.5s linear infinite; }
            @keyframes player-run {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            .player-character.running .leg-left { animation: leg-run-left 0.5s linear infinite; }
            .player-character.running .leg-right { animation: leg-run-right 0.5s linear infinite; }
            .player-character.running .arm-left { animation: arm-run-left 0.5s linear infinite; }
            .player-character.running .arm-right { animation: arm-run-right 0.5s linear infinite; }
            
            @keyframes leg-run-left { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
            @keyframes leg-run-right { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(-20deg); } }
            @keyframes arm-run-left { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(-20deg); } }
            @keyframes arm-run-right { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
            
            .player-character.jumping .torso { transform: scaleY(1.1); }
            .player-character.jumping .leg { transform: rotate(5deg) scaleY(1.1); }
            .player-character.jumping .leg-right { transform: rotate(-5deg) scaleY(1.1); }
            
            .player-character.ducking { transform: translateY(20px) scaleY(0.7); }
            .player-character.ducking .head { top: 15%; }
            .player-character.ducking .torso { height: 55%; }
            
            .player-character.hit { transform: rotate(90deg) scale(0.9); transition: transform 0.2s; }

            .obstacle-high {
                position: absolute;
                width: 120%;
                height: 15px;
                background: repeating-linear-gradient(45deg, #ffb703, #ffb703 10px, #fb8500 10px, #fb8500 20px);
                border-radius: 5px;
                border: 2px solid #e85d04;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                margin-top: -30px; /* Position it higher */
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }
            .item-point {
                animation: pulse 1.5s ease-in-out infinite;
            }
        `}</style>
    </div>
  );
};

export default RunOfChoices;
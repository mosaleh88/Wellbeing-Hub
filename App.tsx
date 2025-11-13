
import React, { useState, useCallback, useEffect } from 'react';
import HomePage from './components/HomePage';
import Game from './components/Game';
import Quiz from './components/Quiz';
import ReportsDashboard from './components/ReportsDashboard';
import StudentInfoForm from './components/StudentInfoForm';
import Admin from './components/Admin';
import MoodBoard from './components/MoodBoard';
import DecisionDash from './components/DecisionDash';
import HabitBuilder from './components/HabitBuilder';
import FuturePathVisualizer from './components/FuturePathVisualizer';
import TimeSorter from './components/TimeSorter';
import MindSnake from './components/MindSnake';
import GoalRacer from './components/GoalRacer';
import RunOfChoices from './components/RunOfChoices';
import StudyStrategyBuilder from './components/StudyStrategyBuilder';
import TwentyFourHourChallenge from './components/TwentyFourHourChallenge';
import AdminLogin from './components/AdminLogin';
import AdminHub from './components/AdminHub';
import CompletionPage from './components/CompletionPage';

import { CARD_PAIRS as DEFAULT_CARDS } from './constants';
import { QUIZ_QUESTIONS as DEFAULT_QUIZ } from './quizConstants';
import { MOOD_BOARD_ICONS as DEFAULT_MOOD_ICONS } from './moodboardConstants';
import { DECISION_DASH_SCENARIOS as DEFAULT_DECISION_SCENARIOS } from './decisionDashConstants';
import { HABIT_BUILDER_CHALLENGES as DEFAULT_HABITS } from './habitBuilderConstants';
import { FUTURE_PATH_NODES as DEFAULT_FUTURE_NODES } from './futurePathConstants';
import { TIME_SORTER_ITEMS as DEFAULT_TIME_ITEMS } from './timeSorterConstants';
import { MIND_SNAKE_QUESTIONS as DEFAULT_SNAKE_QUESTIONS } from './mindSnakeConstants';
import { GOAL_RACER_CHECKPOINTS as DEFAULT_GOAL_RACER_CHECKPOINTS } from './goalRacerConstants';
import { RUN_OF_CHOICES_MILESTONES as DEFAULT_RUN_MILESTONES } from './runOfChoicesConstants';
import { DEFAULT_STUDY_SUBJECTS, DEFAULT_STUDY_QUOTES } from './studyPlannerConstants';
import { DEFAULT_CHALLENGE_ACTIVITIES } from './twentyFourHourChallengeConstants';


import type { StudentData, QuizAnswer, MoodBoardSelection, ActivityId, StudentInfo, CardContent, Question, MoodBoardIcon, DecisionDashScenarioNode, Habit, FuturePathNode, TimeSorterItem, MindSnakeQuestion, GoalRacerCheckpoint, GoalRacerResult, MindSnakeResult, RunOfChoicesMilestone, RunOfChoicesResult, StudyPlannerResult, StudySubject, StudyQuote, MemoryAnswer, TwentyFourHourChallengeResult, ChallengeActivity } from './types';

// In-memory "database" for student data
const allStudentData: StudentData[] = [];

type Page = 'landing' | 'student-info' | 'activities' | 'completion' | 'admin-login' | 'admin-hub' | 'reports-dashboard' | 'manage-content' | ActivityId;

const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Editable Content State Management
  const [adminPassword, setAdminPassword] = usePersistentState<string>('adminPassword', '2468');
  const [gameCards, setGameCards] = usePersistentState<CardContent[]>('content_gameCards', DEFAULT_CARDS);
  const [quizQuestions, setQuizQuestions] = usePersistentState<Question[]>('content_quizQuestions', DEFAULT_QUIZ);
  const [moodIcons, setMoodIcons] = usePersistentState<MoodBoardIcon[]>('content_moodIcons', DEFAULT_MOOD_ICONS);
  const [decisionScenarios, setDecisionScenarios] = usePersistentState<DecisionDashScenarioNode[]>('content_decisionScenarios', DEFAULT_DECISION_SCENARIOS);
  const [habitChallenges, setHabitChallenges] = usePersistentState<Habit[]>('content_habitChallenges', DEFAULT_HABITS);
  const [futurePathNodes, setFuturePathNodes] = usePersistentState<FuturePathNode[]>('content_futurePathNodes', DEFAULT_FUTURE_NODES);
  const [timeSorterItems, setTimeSorterItems] = usePersistentState<TimeSorterItem[]>('content_timeSorterItems', DEFAULT_TIME_ITEMS);
  const [mindSnakeQuestions, setMindSnakeQuestions] = usePersistentState<MindSnakeQuestion[]>('content_mindSnakeQuestions', DEFAULT_SNAKE_QUESTIONS);
  const [goalRacerCheckpoints, setGoalRacerCheckpoints] = usePersistentState<GoalRacerCheckpoint[]>('content_goalRacerCheckpoints', DEFAULT_GOAL_RACER_CHECKPOINTS);
  const [runOfChoicesMilestones, setRunOfChoicesMilestones] = usePersistentState<RunOfChoicesMilestone[]>('content_runOfChoicesMilestones', DEFAULT_RUN_MILESTONES);
  const [studyPlannerSubjects, setStudyPlannerSubjects] = usePersistentState<StudySubject[]>('content_studySubjects', DEFAULT_STUDY_SUBJECTS);
  const [studyPlannerQuotes, setStudyPlannerQuotes] = usePersistentState<StudyQuote[]>('content_studyQuotes', DEFAULT_STUDY_QUOTES);
  const [challengeActivities, setChallengeActivities] = usePersistentState<ChallengeActivity[]>('content_challengeActivities', DEFAULT_CHALLENGE_ACTIVITIES);


  const handleStart = () => {
    setCurrentPage('student-info');
  };

  const handleStudentInfoSubmit = (info: StudentInfo) => {
    const newData: StudentData = {
      studentInfo: info,
    };
    setStudentData(newData);
    setCurrentPage('activities');
  };

  const handleSelectActivity = (activityId: ActivityId) => {
    setCurrentPage(activityId);
  };
  
  const handleActivityComplete = useCallback((data: any, activityId: ActivityId) => {
    if (studentData) {
      const updatedData = { ...studentData };
      switch (activityId) {
        case 'quiz': updatedData.quizAnswers = data as QuizAnswer[]; break;
        case 'mood': updatedData.moodBoard = data as MoodBoardSelection[]; break;
        case 'memory': 
          const memoryResult = data as { moves: number; answers: MemoryAnswer[] };
          updatedData.gameMoves = memoryResult.moves;
          updatedData.memoryAnswers = memoryResult.answers;
          break;
        case 'decision': updatedData.decisionPath = data as string[]; break;
        case 'habit': updatedData.habitProgress = data as number; break;
        case 'future': updatedData.futurePath = data as string; break;
        case 'time': updatedData.timeSorterScore = data as number; break;
        case 'mindSnake': updatedData.mindSnakeResult = data as MindSnakeResult; break;
        case 'goalRacer': updatedData.goalRacerResult = data as GoalRacerResult; break;
        case 'runOfChoices': updatedData.runOfChoicesResult = data as RunOfChoicesResult; break;
        case 'studyPlanner': updatedData.studyPlannerResult = data as StudyPlannerResult; break;
        case 'twentyFourHourChallenge': updatedData.twentyFourHourChallengeResult = data as TwentyFourHourChallengeResult; break;
      }
      setStudentData(updatedData);
    }
    setCurrentPage('activities');
  }, [studentData]);

  const handleFinish = () => {
    if (studentData) {
      const existingIndex = allStudentData.findIndex(d => d.studentInfo.name === studentData.studentInfo.name && d.studentInfo.grade === studentData.studentInfo.grade);
      if (existingIndex > -1) {
        allStudentData[existingIndex] = studentData;
      } else {
        allStudentData.push(studentData);
      }
      setCurrentPage('completion');
    }
  };
  
  const handleAdminLoginAttempt = (password: string) => {
    if (password === adminPassword) {
      setIsAdminLoggedIn(true);
      setCurrentPage('admin-hub');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentPage('landing');
  };

  const handleResetStudent = () => {
    setStudentData(null);
    setCurrentPage('landing');
  };
  
  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };
  
  const renderPage = () => {
    if (!isAdminLoggedIn) {
        switch (currentPage) {
            case 'landing':
                return <HomePage onStart={handleStart} onViewAdmin={() => setCurrentPage('admin-login')} lang={lang} />;
            case 'student-info':
                return <StudentInfoForm onSubmit={handleStudentInfoSubmit} lang={lang} />;
            case 'activities':
                return <HomePage onSelectActivity={handleSelectActivity} onFinish={handleFinish} lang={lang} studentData={studentData} isActivityHub={true} />;
            case 'memory':
                return <Game cards={gameCards} onComplete={(data) => handleActivityComplete(data, 'memory')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'quiz':
                return <Quiz questions={quizQuestions} onComplete={(data) => handleActivityComplete(data, 'quiz')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'mood':
                return <MoodBoard icons={moodIcons} onComplete={(data) => handleActivityComplete(data, 'mood')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'decision':
                return <DecisionDash scenarios={decisionScenarios} onComplete={(data) => handleActivityComplete(data, 'decision')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'habit':
                return <HabitBuilder challenges={habitChallenges} onComplete={(data) => handleActivityComplete(data, 'habit')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'future':
                return <FuturePathVisualizer nodes={futurePathNodes} onComplete={(data) => handleActivityComplete(data, 'future')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'time':
                return <TimeSorter items={timeSorterItems} onComplete={(data) => handleActivityComplete(data, 'time')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'mindSnake':
                return <MindSnake questions={mindSnakeQuestions} onComplete={(data) => handleActivityComplete(data, 'mindSnake')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'goalRacer':
                return <GoalRacer checkpoints={goalRacerCheckpoints} onComplete={(data) => handleActivityComplete(data, 'goalRacer')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'runOfChoices':
                return <RunOfChoices milestones={runOfChoicesMilestones} onComplete={(data) => handleActivityComplete(data, 'runOfChoices')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'studyPlanner':
                return <StudyStrategyBuilder subjects={studyPlannerSubjects} quotes={studyPlannerQuotes} onComplete={(data) => handleActivityComplete(data, 'studyPlanner')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'twentyFourHourChallenge':
                return <TwentyFourHourChallenge activities={challengeActivities} onComplete={(data) => handleActivityComplete(data, 'twentyFourHourChallenge')} lang={lang} studentInfo={studentData?.studentInfo} />;
            case 'completion':
                return <CompletionPage studentData={studentData} onReset={handleResetStudent} lang={lang} />;
            case 'admin-login':
                return <AdminLogin onLogin={handleAdminLoginAttempt} lang={lang} onBack={() => setCurrentPage('landing')} />;
            default:
                return <HomePage onStart={handleStart} onViewAdmin={() => setCurrentPage('admin-login')} lang={lang} />;
        }
    } else { // Admin is logged in
        switch(currentPage) {
            case 'admin-hub':
                return <AdminHub onNavigate={setCurrentPage} onLogout={handleLogout} lang={lang} />;
            case 'manage-content':
                return <Admin 
                          currentPassword={adminPassword} onPasswordChange={setAdminPassword} 
                          onBack={() => setCurrentPage('admin-hub')} lang={lang} 
                          gameCards={gameCards} setGameCards={setGameCards}
                          quizQuestions={quizQuestions} setQuizQuestions={setQuizQuestions}
                          moodIcons={moodIcons} setMoodIcons={setMoodIcons}
                          decisionScenarios={decisionScenarios} setDecisionScenarios={setDecisionScenarios}
                          habitChallenges={habitChallenges} setHabitChallenges={setHabitChallenges}
                          futurePathNodes={futurePathNodes} setFuturePathNodes={setFuturePathNodes}
                          timeSorterItems={timeSorterItems} setTimeSorterItems={setTimeSorterItems}
                          mindSnakeQuestions={mindSnakeQuestions} setMindSnakeQuestions={setMindSnakeQuestions}
                          goalRacerCheckpoints={goalRacerCheckpoints} setGoalRacerCheckpoints={setGoalRacerCheckpoints}
                          runOfChoicesMilestones={runOfChoicesMilestones} setRunOfChoicesMilestones={setRunOfChoicesMilestones}
                          studyPlannerSubjects={studyPlannerSubjects} setStudyPlannerSubjects={setStudyPlannerSubjects}
                          studyPlannerQuotes={studyPlannerQuotes} setStudyPlannerQuotes={setStudyPlannerQuotes}
                          challengeActivities={challengeActivities} setChallengeActivities={setChallengeActivities}
                       />;
            case 'reports-dashboard':
                return <ReportsDashboard allStudentData={allStudentData} onBack={() => setCurrentPage('admin-hub')} lang={lang} />;
            default:
                 return <AdminHub onNavigate={setCurrentPage} onLogout={handleLogout} lang={lang} />;
        }
    }
  };

  return (
    <div className={`min-h-screen font-sans ${lang === 'ar' ? 'rtl font-cairo' : 'ltr'} flex flex-col`}>
      <div className="fixed top-4 right-4 z-[100]">
        <button onClick={toggleLang} className="bg-white/80 backdrop-blur-sm text-[#4F46E5] font-bold py-2 px-4 rounded-lg shadow-md hover:bg-white transition-colors border border-gray-200">
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
      </div>
      <main className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
        {renderPage()}
      </main>
      <footer className="text-center p-4 bg-gray-100 text-gray-600 text-sm border-t border-gray-200">
        © 2025 Mr. Mostafa Darwish
      </footer>
    </div>
  );
};

export default App;

// FIX: Removed self-import of LocalizedString type.
export interface LocalizedString {
  en: string;
  ar: string;
}

// For editable content in Admin.tsx
export interface CardContent {
  id: string;
  pairId: string;
  icon: string;
  prompt: LocalizedString;
}

// For in-game state in Game.tsx
export interface Card extends CardContent {
  instanceId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

// For Memory Game answers
export interface MemoryAnswer {
  prompt: LocalizedString;
  answer: string;
}

// For Student Info Form (components/StudentInfoForm.tsx)
export interface StudentInfo {
  name: string;
  grade: string;
}

// For Quiz (components/Quiz.tsx)
export type QuestionType = 'mcq' | 'reflection';

export interface Question {
  id: string;
  type: QuestionType;
  question: LocalizedString;
  options?: { en: string[]; ar: string[] };
  correctAnswer?: { en: string; ar: string };
};

export interface QuizAnswer {
  question: LocalizedString;
  answer: string;
  isCorrect?: boolean;
}

// For Mood Board (components/MoodBoard.tsx)
export interface MoodBoardIcon {
  id: string;
  icon: string;
  label: LocalizedString;
}

export interface MoodBoardSelection {
  icon: string;
  label: LocalizedString;
  reason: string;
}

// For Decision Dash (components/DecisionDash.tsx)
export interface DecisionDashEffects {
  respect: number;
  focus: number;
  responsibility: number;
}

export interface DecisionDashChoice {
  text: LocalizedString;
  effects: DecisionDashEffects;
  nextId: string;
}

export interface DecisionDashScenarioNode {
  id: string;
  icon: string;
  text: LocalizedString;
  choices: DecisionDashChoice[];
}

// For Habit Builder (components/HabitBuilder.tsx)
export interface Habit {
  id: string;
  prompt: LocalizedString;
  days: number;
}

// For Future Path Visualizer (components/FuturePathVisualizer.tsx)
export interface FuturePathChoice {
  text: LocalizedString;
  nextId: string;
}

export type FuturePathNodeType = 'interest' | 'path' | 'outcome';

export interface FuturePathNode {
  id:string;
  type: FuturePathNodeType;
  icon: string;
  text: LocalizedString;
  choices?: FuturePathChoice[];
  message?: LocalizedString;
}


// For Time Sorter (components/TimeSorter.tsx)
export type TimeSorterItemType = 'booster' | 'waster';

export interface TimeSorterItem {
  id: string;
  text: LocalizedString;
  type: TimeSorterItemType;
}

// For Mind Snake (components/MindSnake.tsx)
export interface MindSnakeQuestion {
  id: string;
  icon: string;
  prompt: LocalizedString;
}

export interface MindSnakeResult {
  score: number;
  answers: { question: LocalizedString; answer: string }[];
}


// For Goal Racer (components/GoalRacer.tsx)
export interface GoalRacerCheckpoint {
  id: string;
  question: LocalizedString;
}

export interface GoalRacerResult {
  focusLevel: number;
  effortBoost: number;
  growthPoints: number;
  answers: { question: LocalizedString; answer: string }[];
}

// For Run of Choices (components/RunOfChoices.tsx)
export interface RunOfChoicesMilestone {
  id: string;
  distance: number; // The distance at which this milestone triggers
  prompt: LocalizedString;
}

export interface RunOfChoicesResult {
  score: number; // Focus points
  distance: number;
  answers: { question: LocalizedString; answer: string }[];
}

// For Study Strategy Builder (components/StudyStrategyBuilder.tsx)
export interface StudySubject {
  id: string;
  name: LocalizedString;
  icon: string;
}

export interface StudyQuote {
  id: string;
  text: LocalizedString;
}

export type StudyTime = 'morning' | 'afternoon' | 'evening';

export interface StudyPlannerInput {
  subjects: {
    subjectId: string;
    difficulty: number;
    goal: string;
  }[];
  focusDuration: number;
  studyTimes: StudyTime[];
  examDays: number;
}

export type StudyPlannerResult = StudyPlannerInput;

// For 24-Hour Challenge (components/TwentyFourHourChallenge.tsx)
export interface ChallengeActivity {
  id: string;
  name: LocalizedString;
  icon: string;
  color: string; // e.g., 'bg-sky-400'
}

export interface TwentyFourHourChallengeResult {
  currentDay: (string | null)[]; // Array of activity IDs for each hour
  idealDay: (string | null)[];
}


// For Admin & AI Report
export interface StudentData {
  studentInfo: StudentInfo;
  quizAnswers?: QuizAnswer[];
  moodBoard?: MoodBoardSelection[];
  gameMoves?: number;
  memoryAnswers?: MemoryAnswer[];
  decisionPath?: string[];
  habitProgress?: number;
  futurePath?: string;
  timeSorterScore?: number;
  mindSnakeResult?: MindSnakeResult;
  goalRacerResult?: GoalRacerResult;
  runOfChoicesResult?: RunOfChoicesResult;
  studyPlannerResult?: StudyPlannerResult;
  twentyFourHourChallengeResult?: TwentyFourHourChallengeResult;
}

export type ActivityId = 'memory' | 'quiz' | 'mood' | 'decision' | 'habit' | 'future' | 'time' | 'mindSnake' | 'goalRacer' | 'runOfChoices' | 'studyPlanner' | 'twentyFourHourChallenge';
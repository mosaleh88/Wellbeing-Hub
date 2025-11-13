
import React, { useState } from 'react';
import type { CardContent, Question, MoodBoardIcon, DecisionDashScenarioNode, Habit, FuturePathNode, TimeSorterItem, MindSnakeQuestion, DecisionDashChoice, FuturePathChoice, LocalizedString, QuestionType, FuturePathNodeType, TimeSorterItemType, GoalRacerCheckpoint, RunOfChoicesMilestone, StudySubject, StudyQuote, ChallengeActivity } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper components for cleaner forms
const FieldSet: React.FC<{legend: string; children: React.ReactNode}> = ({ legend, children }) => (
  <fieldset className="p-4 mb-4 border rounded-lg bg-gray-50 border-gray-200">
    <legend className="px-2 font-semibold text-gray-700">{legend}</legend>
    {children}
  </fieldset>
);
const TextInput = ({ label, value, onChange }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div><label className="block text-sm font-medium text-gray-600">{label}</label><input type="text" value={value} onChange={onChange} className="w-full p-2 mt-1 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" /></div>
);
const TextareaInput = ({ label, value, onChange }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) => (
  <div><label className="block text-sm font-medium text-gray-600">{label}</label><textarea value={value} onChange={onChange} className="w-full p-2 mt-1 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" rows={2}/></div>
);
const NumberInput = ({ label, value, onChange }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div><label className="block text-sm font-medium text-gray-600">{label}</label><input type="number" value={value} onChange={onChange} className="w-full p-2 mt-1 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" /></div>
);
const SelectInput = ({ label, value, onChange, options }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[] }) => (
    <div><label className="block text-sm font-medium text-gray-600">{label}</label>
      <select value={value} onChange={onChange} className="w-full p-2 mt-1 border rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
);
const DeleteButton: React.FC<{onClick: () => void}> = ({ onClick }) => (
    <button onClick={onClick} className="mt-4 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">Delete</button>
);
const AddButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
    <button onClick={onClick} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">{children}</button>
);

// Props for the main Admin component
interface Props {
  currentPassword?: string;
  onPasswordChange?: (newPassword: string) => void;
  onBack: () => void;
  lang: 'en' | 'ar';
  
  gameCards: CardContent[];
  setGameCards: React.Dispatch<React.SetStateAction<CardContent[]>>;
  quizQuestions: Question[];
  setQuizQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  moodIcons: MoodBoardIcon[];
  setMoodIcons: React.Dispatch<React.SetStateAction<MoodBoardIcon[]>>;
  decisionScenarios: DecisionDashScenarioNode[];
  setDecisionScenarios: React.Dispatch<React.SetStateAction<DecisionDashScenarioNode[]>>;
  habitChallenges: Habit[];
  setHabitChallenges: React.Dispatch<React.SetStateAction<Habit[]>>;
  futurePathNodes: FuturePathNode[];
  setFuturePathNodes: React.Dispatch<React.SetStateAction<FuturePathNode[]>>;
  timeSorterItems: TimeSorterItem[];
  setTimeSorterItems: React.Dispatch<React.SetStateAction<TimeSorterItem[]>>;
  mindSnakeQuestions: MindSnakeQuestion[];
  setMindSnakeQuestions: React.Dispatch<React.SetStateAction<MindSnakeQuestion[]>>;
  goalRacerCheckpoints: GoalRacerCheckpoint[];
  setGoalRacerCheckpoints: React.Dispatch<React.SetStateAction<GoalRacerCheckpoint[]>>;
  runOfChoicesMilestones: RunOfChoicesMilestone[];
  setRunOfChoicesMilestones: React.Dispatch<React.SetStateAction<RunOfChoicesMilestone[]>>;
  studyPlannerSubjects: StudySubject[];
  setStudyPlannerSubjects: React.Dispatch<React.SetStateAction<StudySubject[]>>;
  studyPlannerQuotes: StudyQuote[];
  setStudyPlannerQuotes: React.Dispatch<React.SetStateAction<StudyQuote[]>>;
  challengeActivities: ChallengeActivity[];
  setChallengeActivities: React.Dispatch<React.SetStateAction<ChallengeActivity[]>>;
}

type AdminSection = 'memory' | 'quiz' | 'mood' | 'decision' | 'habit' | 'future' | 'time' | 'mindSnake' | 'goalRacer' | 'runOfChoices' | 'studyPlanner' | 'twentyFourHourChallenge' | 'settings';

// --- MAIN ADMIN COMPONENT ---
const Admin: React.FC<Props> = (props) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('memory');
  
  const content = {
    en: {
      title: "Manage Content", back: "Back to Admin Hub", settings: "Settings", save: "Save", delete: "Delete", addNew: "Add New",
      memory: "Reflection Match", quiz: "Wellbeing Quiz", mood: "Mood Board", decision: "Choice Navigator", habit: "Habit Builder",
      future: "Path Explorer", time: "Energy Sorter", mindSnake: "Mind Snake", goalRacer: "Goal Racer", runOfChoices: "Focus Runner", studyPlanner: "Study Planner",
      twentyFourHourChallenge: "24-Hour Challenge",
    },
    ar: {
      title: "إدارة المحتوى", back: "العودة إلى لوحة التحكم", settings: "الإعدادات", save: "حفظ", delete: "حذف", addNew: "إضافة جديد",
      memory: "تطابق التأمل", quiz: "اختبار السلامة النفسية", mood: "لوحة المزاج", decision: "مستكشف الخيارات", habit: "باني العادات",
      future: "مستكشف المسارات", time: "مصنف الطاقة", mindSnake: "ثعبان العقل", goalRacer: "متسابق الأهداف", runOfChoices: "عداء التركيز", studyPlanner: "مخطط الدراسة",
      twentyFourHourChallenge: "تحدي الـ 24 ساعة",
    }
  };
  
  const renderSection = () => {
    switch(activeSection) {
      case 'memory': return <MemoryAdmin {...props} />;
      case 'quiz': return <QuizAdmin {...props} />;
      case 'mood': return <MoodAdmin {...props} />;
      case 'decision': return <DecisionAdmin {...props} />;
      case 'habit': return <HabitAdmin {...props} />;
      case 'future': return <FutureAdmin {...props} />;
      case 'time': return <TimeSorterAdmin {...props} />;
      case 'mindSnake': return <MindSnakeAdmin {...props} />;
      case 'goalRacer': return <GoalRacerAdmin {...props} />;
      case 'runOfChoices': return <RunOfChoicesAdmin {...props} />;
      case 'studyPlanner': return <StudyPlannerAdmin {...props} />;
      case 'twentyFourHourChallenge': return <TwentyFourHourChallengeAdmin {...props} />;
      case 'settings': return <PasswordSettings lang={props.lang} currentPassword={props.currentPassword} onPasswordChange={props.onPasswordChange} />;
      default: return <p>Select an activity to edit.</p>
    }
  }
  
  const NavItem = ({ section, label }: {section: AdminSection, label: string}) => (
    <button 
      onClick={() => setActiveSection(section)}
      className={`w-full text-left p-3 rounded-lg font-semibold transition-colors text-gray-700 ${activeSection === section ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl min-h-[80vh]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">{content[props.lang].title}</h1>
        <button onClick={props.onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">
          {content[props.lang].back}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <nav className="md:w-1/4 space-y-1">
          <NavItem section="memory" label={content[props.lang].memory} />
          <NavItem section="quiz" label={content[props.lang].quiz} />
          <NavItem section="mood" label={content[props.lang].mood} />
          <NavItem section="decision" label={content[props.lang].decision} />
          <NavItem section="habit" label={content[props.lang].habit} />
          <NavItem section="future" label={content[props.lang].future} />
          <NavItem section="time" label={content[props.lang].time} />
          <NavItem section="twentyFourHourChallenge" label={content[props.lang].twentyFourHourChallenge} />
          <NavItem section="mindSnake" label={content[props.lang].mindSnake} />
          <NavItem section="goalRacer" label={content[props.lang].goalRacer} />
          <NavItem section="runOfChoices" label={content[props.lang].runOfChoices} />
          <NavItem section="studyPlanner" label={content[props.lang].studyPlanner} />
          <hr className="my-2"/>
          <NavItem section="settings" label={content[props.lang].settings} />
        </nav>
        <main className="md:w-3/4 max-h-[70vh] overflow-y-auto pr-4">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};


// --- GENERIC HANDLERS ---
const handleUpdate = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string, field: keyof T, value: any) => {
    setter(prev => prev.map(item => (item as { id: string }).id === id ? { ...item, [field]: value } : item));
};
const handleNestedUpdate = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string, field: keyof T, subfield: 'en' | 'ar', value: any) => {
    setter(prev => prev.map(item => {
        if ((item as { id: string }).id !== id) return item;
        const updatedField = { ...(item[field] as object || {}), [subfield]: value };
        return { ...item, [field]: updatedField };
    }));
};
const handleDelete = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string) => {
    setter(prev => prev.filter(item => item.id !== id));
};
const handleAdd = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, newItem: T) => {
    setter(prev => [...prev, newItem]);
};

// --- SUB-COMPONENTS FOR EACH ACTIVITY ---
const MemoryAdmin: React.FC<Props> = ({ gameCards, setGameCards }) => (
  <div>
    {gameCards.map(card => (
      <FieldSet key={card.id} legend={`Card: ${card.icon}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Icon" value={card.icon} onChange={(e) => handleUpdate(setGameCards, card.id, 'icon', e.target.value)} />
          <TextInput label="Pair ID" value={card.pairId} onChange={(e) => handleUpdate(setGameCards, card.id, 'pairId', e.target.value)} />
          <TextareaInput label="Prompt (EN)" value={card.prompt.en} onChange={(e) => handleNestedUpdate(setGameCards, card.id, 'prompt', 'en', e.target.value)} />
          <TextareaInput label="Prompt (AR)" value={card.prompt.ar} onChange={(e) => handleNestedUpdate(setGameCards, card.id, 'prompt', 'ar', e.target.value)} />
        </div>
        <DeleteButton onClick={() => handleDelete(setGameCards, card.id)} />
      </FieldSet>
    ))}
    <AddButton onClick={() => handleAdd(setGameCards, { id: uuidv4(), pairId: 'new-pair', icon: '❓', prompt: { en: '', ar: '' } })}>Add New Card Pair</AddButton>
  </div>
);

const QuizAdmin: React.FC<Props> = ({ quizQuestions, setQuizQuestions }) => (
    <div>
    {quizQuestions.map(q => (
      <FieldSet key={q.id} legend={`Question: ${q.question.en.substring(0,20)}...`}>
        <div className="space-y-4">
          <TextareaInput label="Question (EN)" value={q.question.en} onChange={(e) => handleNestedUpdate(setQuizQuestions, q.id, 'question', 'en', e.target.value)} />
          <TextareaInput label="Question (AR)" value={q.question.ar} onChange={(e) => handleNestedUpdate(setQuizQuestions, q.id, 'question', 'ar', e.target.value)} />
          <SelectInput label="Type" value={q.type} onChange={(e) => handleUpdate(setQuizQuestions, q.id, 'type', e.target.value as QuestionType)} options={[{value: 'mcq', label: 'Multiple Choice'}, {value: 'reflection', label: 'Reflection'}]} />
          {q.type === 'mcq' && (
            <div className="pl-4 border-l-2 space-y-2">
              {(q.options?.en || []).map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <TextInput label={`EN Option ${i+1}`} value={opt} onChange={(e) => {
                      const newOptions = {...q.options!}; newOptions.en[i] = e.target.value;
                      handleUpdate(setQuizQuestions, q.id, 'options', newOptions);
                  }} />
                  <TextInput label={`AR Option ${i+1}`} value={q.options?.ar[i] || ''} onChange={(e) => {
                       const newOptions = {...q.options!}; newOptions.ar[i] = e.target.value;
                       handleUpdate(setQuizQuestions, q.id, 'options', newOptions);
                  }} />
                </div>
              ))}
              <TextInput label="Correct Answer (EN)" value={q.correctAnswer?.en || ''} onChange={(e) => handleNestedUpdate(setQuizQuestions, q.id, 'correctAnswer', 'en', e.target.value)} />
              <TextInput label="Correct Answer (AR)" value={q.correctAnswer?.ar || ''} onChange={(e) => handleNestedUpdate(setQuizQuestions, q.id, 'correctAnswer', 'ar', e.target.value)} />
            </div>
          )}
        </div>
        <DeleteButton onClick={() => handleDelete(setQuizQuestions, q.id)} />
      </FieldSet>
    ))}
    <AddButton onClick={() => handleAdd(setQuizQuestions, { id: uuidv4(), type: 'mcq', question: {en: '', ar: ''}, options: {en:['','',''], ar:['','','']}, correctAnswer: {en:'', ar:''} })}>Add New Question</AddButton>
  </div>
);

const MoodAdmin: React.FC<Props> = ({ moodIcons, setMoodIcons }) => (
  <div>
    {moodIcons.map(icon => (
      <FieldSet key={icon.id} legend={`Icon: ${icon.icon}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <TextInput label="Icon" value={icon.icon} onChange={(e) => handleUpdate(setMoodIcons, icon.id, 'icon', e.target.value)} />
          <TextInput label="Label (EN)" value={icon.label.en} onChange={(e) => handleNestedUpdate(setMoodIcons, icon.id, 'label', 'en', e.target.value)} />
          <TextInput label="Label (AR)" value={icon.label.ar} onChange={(e) => handleNestedUpdate(setMoodIcons, icon.id, 'label', 'ar', e.target.value)} />
        </div>
        <DeleteButton onClick={() => handleDelete(setMoodIcons, icon.id)} />
      </FieldSet>
    ))}
    <AddButton onClick={() => handleAdd(setMoodIcons, { id: uuidv4(), icon: '❓', label: { en: '', ar: '' } })}>Add New Icon</AddButton>
  </div>
);

const HabitAdmin: React.FC<Props> = ({ habitChallenges, setHabitChallenges }) => (
    <div>
        {habitChallenges.map(habit => (
            <FieldSet key={habit.id} legend={`Habit: ${habit.prompt.en.substring(0, 20)}...`}>
                <div className="space-y-4">
                    <TextareaInput label="Prompt (EN)" value={habit.prompt.en} onChange={(e) => handleNestedUpdate(setHabitChallenges, habit.id, 'prompt', 'en', e.target.value)} />
                    <TextareaInput label="Prompt (AR)" value={habit.prompt.ar} onChange={(e) => handleNestedUpdate(setHabitChallenges, habit.id, 'prompt', 'ar', e.target.value)} />
                    <NumberInput label="Days" value={habit.days} onChange={(e) => handleUpdate(setHabitChallenges, habit.id, 'days', parseInt(e.target.value, 10))} />
                </div>
                <DeleteButton onClick={() => handleDelete(setHabitChallenges, habit.id)} />
            </FieldSet>
        ))}
        <AddButton onClick={() => handleAdd(setHabitChallenges, { id: uuidv4(), prompt: {en: '', ar: ''}, days: 21 })}>Add New Habit</AddButton>
    </div>
);

const DecisionAdmin: React.FC<Props> = ({ decisionScenarios, setDecisionScenarios }) => (
  <div>
      {decisionScenarios.map(node => (
          <FieldSet key={node.id} legend={`Node: ${node.id}`}>
              <div className="space-y-4">
                  <TextInput label="Node ID" value={node.id} onChange={(e) => handleUpdate(setDecisionScenarios, node.id, 'id', e.target.value.toUpperCase())} />
                  <TextInput label="Icon" value={node.icon} onChange={(e) => handleUpdate(setDecisionScenarios, node.id, 'icon', e.target.value)} />
                  <TextareaInput label="Text (EN)" value={node.text.en} onChange={(e) => handleNestedUpdate(setDecisionScenarios, node.id, 'text', 'en', e.target.value)} />
                  <TextareaInput label="Text (AR)" value={node.text.ar} onChange={(e) => handleNestedUpdate(setDecisionScenarios, node.id, 'text', 'ar', e.target.value)} />
                  <h4 className="font-semibold pt-2 border-t mt-2">Choices</h4>
                  {node.choices.map((choice, index) => (
                      <div key={index} className="p-3 border rounded bg-white relative">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <TextareaInput label={`Choice ${index+1} (EN)`} value={choice.text.en} onChange={(e) => {
                                  const newChoices = [...node.choices]; newChoices[index].text.en = e.target.value;
                                  handleUpdate(setDecisionScenarios, node.id, 'choices', newChoices);
                              }} />
                              <TextareaInput label={`Choice ${index+1} (AR)`} value={choice.text.ar} onChange={(e) => {
                                  const newChoices = [...node.choices]; newChoices[index].text.ar = e.target.value;
                                  handleUpdate(setDecisionScenarios, node.id, 'choices', newChoices);
                              }} />
                              <TextInput label="Next Node ID" value={choice.nextId} onChange={(e) => {
                                  const newChoices = [...node.choices]; newChoices[index].nextId = e.target.value.toUpperCase();
                                  handleUpdate(setDecisionScenarios, node.id, 'choices', newChoices);
                              }} />
                          </div>
                          <button onClick={() => {
                              const newChoices = node.choices.filter((_, i) => i !== index);
                              handleUpdate(setDecisionScenarios, node.id, 'choices', newChoices);
                          }} className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded">X</button>
                      </div>
                  ))}
                  <AddButton onClick={() => {
                      const newChoice: DecisionDashChoice = { text: { en: '', ar: '' }, effects: { respect: 0, focus: 0, responsibility: 0 }, nextId: '' };
                      handleUpdate(setDecisionScenarios, node.id, 'choices', [...node.choices, newChoice]);
                  }}>Add Choice</AddButton>
              </div>
              <DeleteButton onClick={() => handleDelete(setDecisionScenarios, node.id)} />
          </FieldSet>
      ))}
      <AddButton onClick={() => handleAdd(setDecisionScenarios, { id: 'NEW_NODE', icon: '❓', text: { en: '', ar: '' }, choices: [] })}>Add New Node</AddButton>
  </div>
);

const FutureAdmin: React.FC<Props> = ({ futurePathNodes, setFuturePathNodes }) => (
  <div>
    {futurePathNodes.map(node => (
        <FieldSet key={node.id} legend={`Node: ${node.id}`}>
            <div className="space-y-4">
                <TextInput label="Node ID" value={node.id} onChange={(e) => handleUpdate(setFuturePathNodes, node.id, 'id', e.target.value.toUpperCase())} />
                <SelectInput label="Node Type" value={node.type} onChange={e => handleUpdate(setFuturePathNodes, node.id, 'type', e.target.value as FuturePathNodeType)} options={[{value: 'interest', label:'Interest'}, {value:'path', label:'Path'}, {value:'outcome', label:'Outcome'}]} />
                <TextInput label="Icon" value={node.icon} onChange={(e) => handleUpdate(setFuturePathNodes, node.id, 'icon', e.target.value)} />
                <TextareaInput label="Text (EN)" value={node.text.en} onChange={(e) => handleNestedUpdate(setFuturePathNodes, node.id, 'text', 'en', e.target.value)} />
                <TextareaInput label="Text (AR)" value={node.text.ar} onChange={(e) => handleNestedUpdate(setFuturePathNodes, node.id, 'text', 'ar', e.target.value)} />
                {node.type === 'outcome' && (
                  <>
                    <TextareaInput label="Message (EN)" value={node.message?.en || ''} onChange={(e) => handleNestedUpdate(setFuturePathNodes, node.id, 'message', 'en', e.target.value)} />
                    <TextareaInput label="Message (AR)" value={node.message?.ar || ''} onChange={(e) => handleNestedUpdate(setFuturePathNodes, node.id, 'message', 'ar', e.target.value)} />
                  </>
                )}
                {node.type !== 'outcome' && (<h4 className="font-semibold pt-2 border-t mt-2">Choices</h4>)}
                {node.choices?.map((choice, index) => (
                    <div key={index} className="p-3 border rounded bg-white relative">
                        <TextInput label={`Choice ${index+1} (EN)`} value={choice.text.en} onChange={(e) => {
                            const newChoices = [...node.choices!]; newChoices[index].text.en = e.target.value;
                            handleUpdate(setFuturePathNodes, node.id, 'choices', newChoices);
                        }} />
                        <TextInput label={`Choice ${index+1} (AR)`} value={choice.text.ar} onChange={(e) => {
                            const newChoices = [...node.choices!]; newChoices[index].text.ar = e.target.value;
                            handleUpdate(setFuturePathNodes, node.id, 'choices', newChoices);
                        }} />
                        <TextInput label="Next Node ID" value={choice.nextId} onChange={(e) => {
                            const newChoices = [...node.choices!]; newChoices[index].nextId = e.target.value.toUpperCase();
                            handleUpdate(setFuturePathNodes, node.id, 'choices', newChoices);
                        }} />
                        <button onClick={() => {
                            const newChoices = node.choices!.filter((_, i) => i !== index);
                            handleUpdate(setFuturePathNodes, node.id, 'choices', newChoices);
                        }} className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded">X</button>
                    </div>
                ))}
                 {node.type !== 'outcome' && (
                     <AddButton onClick={() => {
                        const newChoice: FuturePathChoice = { text: { en: '', ar: '' }, nextId: '' };
                        handleUpdate(setFuturePathNodes, node.id, 'choices', [...(node.choices || []), newChoice]);
                    }}>Add Choice</AddButton>
                 )}
            </div>
            <DeleteButton onClick={() => handleDelete(setFuturePathNodes, node.id)} />
        </FieldSet>
    ))}
    <AddButton onClick={() => handleAdd(setFuturePathNodes, { id: 'NEW_NODE', type: 'interest', icon: '❓', text: { en: '', ar: '' }, choices: [] })}>Add New Node</AddButton>
  </div>
);

const TimeSorterAdmin: React.FC<Props> = ({ timeSorterItems, setTimeSorterItems }) => (
  <div>
      {timeSorterItems.map(item => (
          <FieldSet key={item.id} legend={`Item: ${item.text.en.substring(0,20)}...`}>
              <div className="space-y-4">
                  <TextareaInput label="Text (EN)" value={item.text.en} onChange={(e) => handleNestedUpdate(setTimeSorterItems, item.id, 'text', 'en', e.target.value)} />
                  <TextareaInput label="Text (AR)" value={item.text.ar} onChange={(e) => handleNestedUpdate(setTimeSorterItems, item.id, 'text', 'ar', e.target.value)} />
                  <SelectInput label="Type" value={item.type} onChange={e => handleUpdate(setTimeSorterItems, item.id, 'type', e.target.value as TimeSorterItemType)} options={[{value: 'booster', label:'Booster'}, {value:'waster', label:'Waster'}]} />
              </div>
              <DeleteButton onClick={() => handleDelete(setTimeSorterItems, item.id)} />
          </FieldSet>
      ))}
      <AddButton onClick={() => handleAdd(setTimeSorterItems, { id: uuidv4(), text: {en:'', ar:''}, type: 'booster' })}>Add New Item</AddButton>
  </div>
);

const TwentyFourHourChallengeAdmin: React.FC<Props> = ({ challengeActivities, setChallengeActivities }) => (
  <div>
    {challengeActivities.map(activity => (
      <FieldSet key={activity.id} legend={`Activity: ${activity.name.en}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <TextInput label="Icon" value={activity.icon} onChange={(e) => handleUpdate(setChallengeActivities, activity.id, 'icon', e.target.value)} />
          <TextInput label="Name (EN)" value={activity.name.en} onChange={(e) => handleNestedUpdate(setChallengeActivities, activity.id, 'name', 'en', e.target.value)} />
          <TextInput label="Name (AR)" value={activity.name.ar} onChange={(e) => handleNestedUpdate(setChallengeActivities, activity.id, 'name', 'ar', e.target.value)} />
          <TextInput label="Color (e.g. bg-sky-400)" value={activity.color} onChange={(e) => handleUpdate(setChallengeActivities, activity.id, 'color', e.target.value)} />
        </div>
        <DeleteButton onClick={() => handleDelete(setChallengeActivities, activity.id)} />
      </FieldSet>
    ))}
    <AddButton onClick={() => handleAdd(setChallengeActivities, { id: uuidv4(), icon: '🆕', name: { en: 'New Activity', ar: 'نشاط جديد' }, color: 'bg-gray-400' })}>Add New Activity</AddButton>
  </div>
);


const MindSnakeAdmin: React.FC<Props> = ({ mindSnakeQuestions, setMindSnakeQuestions }) => (
  <div>
      {mindSnakeQuestions.map(q => (
          <FieldSet key={q.id} legend={`Question: ${q.icon}`}>
              <div className="space-y-4">
                  <TextInput label="Icon" value={q.icon} onChange={e => handleUpdate(setMindSnakeQuestions, q.id, 'icon', e.target.value)} />
                  <TextareaInput label="Prompt (EN)" value={q.prompt.en} onChange={(e) => handleNestedUpdate(setMindSnakeQuestions, q.id, 'prompt', 'en', e.target.value)} />
                  <TextareaInput label="Prompt (AR)" value={q.prompt.ar} onChange={(e) => handleNestedUpdate(setMindSnakeQuestions, q.id, 'prompt', 'ar', e.target.value)} />
              </div>
              <DeleteButton onClick={() => handleDelete(setMindSnakeQuestions, q.id)} />
          </FieldSet>
      ))}
      <AddButton onClick={() => handleAdd(setMindSnakeQuestions, {id: uuidv4(), icon: '❓', prompt: {en:'', ar:''}})}>Add New Question</AddButton>
  </div>
);

const GoalRacerAdmin: React.FC<Props> = ({ goalRacerCheckpoints, setGoalRacerCheckpoints }) => (
  <div>
      {goalRacerCheckpoints.map(cp => (
          <FieldSet key={cp.id} legend={`Checkpoint: ${cp.question.en.substring(0, 20)}...`}>
              <div className="space-y-4">
                  <TextareaInput label="Question (EN)" value={cp.question.en} onChange={(e) => handleNestedUpdate(setGoalRacerCheckpoints, cp.id, 'question', 'en', e.target.value)} />
                  <TextareaInput label="Question (AR)" value={cp.question.ar} onChange={(e) => handleNestedUpdate(setGoalRacerCheckpoints, cp.id, 'question', 'ar', e.target.value)} />
              </div>
              <DeleteButton onClick={() => handleDelete(setGoalRacerCheckpoints, cp.id)} />
          </FieldSet>
      ))}
      <AddButton onClick={() => handleAdd(setGoalRacerCheckpoints, {id: uuidv4(), question: {en:'', ar:''}})}>Add New Checkpoint</AddButton>
  </div>
);

const RunOfChoicesAdmin: React.FC<Props> = ({ runOfChoicesMilestones, setRunOfChoicesMilestones }) => (
  <div>
    {runOfChoicesMilestones.map(m => (
      <FieldSet key={m.id} legend={`Milestone at ${m.distance}m`}>
        <div className="space-y-4">
          <NumberInput label="Distance (triggers at this distance)" value={m.distance} onChange={e => handleUpdate(setRunOfChoicesMilestones, m.id, 'distance', parseInt(e.target.value, 10))} />
          <TextareaInput label="Prompt (EN)" value={m.prompt.en} onChange={(e) => handleNestedUpdate(setRunOfChoicesMilestones, m.id, 'prompt', 'en', e.target.value)} />
          <TextareaInput label="Prompt (AR)" value={m.prompt.ar} onChange={(e) => handleNestedUpdate(setRunOfChoicesMilestones, m.id, 'prompt', 'ar', e.target.value)} />
        </div>
        <DeleteButton onClick={() => handleDelete(setRunOfChoicesMilestones, m.id)} />
      </FieldSet>
    ))}
    <AddButton onClick={() => handleAdd(setRunOfChoicesMilestones, {id: uuidv4(), distance: 1000, prompt: {en:'', ar:''}})}>Add New Milestone</AddButton>
  </div>
);

const StudyPlannerAdmin: React.FC<Props> = ({ studyPlannerSubjects, studyPlannerQuotes, setStudyPlannerSubjects, setStudyPlannerQuotes }) => (
  <div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">Study Subjects</h3>
    {studyPlannerSubjects.map(s => (
      <FieldSet key={s.id} legend={`Subject: ${s.name.en}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput label="Icon" value={s.icon} onChange={e => handleUpdate(setStudyPlannerSubjects, s.id, 'icon', e.target.value)} />
          <TextInput label="Name (EN)" value={s.name.en} onChange={(e) => handleNestedUpdate(setStudyPlannerSubjects, s.id, 'name', 'en', e.target.value)} />
          <TextInput label="Name (AR)" value={s.name.ar} onChange={(e) => handleNestedUpdate(setStudyPlannerSubjects, s.id, 'name', 'ar', e.target.value)} />
        </div>
        <DeleteButton onClick={() => handleDelete(setStudyPlannerSubjects, s.id)} />
      </FieldSet>
    ))}
    <AddButton onClick={() => handleAdd(setStudyPlannerSubjects, {id: uuidv4(), icon: '📚', name: {en:'', ar:''}})}>Add New Subject</AddButton>
    
    <hr className="my-6" />

    <h3 className="text-xl font-bold mb-2 text-gray-800">Motivational Quotes</h3>
    {studyPlannerQuotes.map(q => (
      <FieldSet key={q.id} legend={`Quote: ${q.text.en.substring(0,20)}...`}>
        <div className="space-y-4">
          <TextareaInput label="Quote (EN)" value={q.text.en} onChange={(e) => handleNestedUpdate(setStudyPlannerQuotes, q.id, 'text', 'en', e.target.value)} />
          <TextareaInput label="Quote (AR)" value={q.text.ar} onChange={(e) => handleNestedUpdate(setStudyPlannerQuotes, q.id, 'text', 'ar', e.target.value)} />
        </div>
        <DeleteButton onClick={() => handleDelete(setStudyPlannerQuotes, q.id)} />
      </FieldSet>
    ))}
    <AddButton onClick={() => handleAdd(setStudyPlannerQuotes, {id: uuidv4(), text: {en:'', ar:''}})}>Add New Quote</AddButton>
  </div>
);


// Password settings sub-component
const PasswordSettings = ({ lang, currentPassword, onPasswordChange }: { lang: 'en' | 'ar', currentPassword?: string, onPasswordChange?: (newPassword: string) => void }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const content = {
    en: { changePass: "Change Password", oldPass: "Old Password", newPass: "New Password", confirmPass: "Confirm New Password", updatePass: "Update Password", passChanged: "Password updated successfully!", passMismatch: "New passwords do not match.", wrongOldPass: "Incorrect old password.", },
    ar: { changePass: "تغيير كلمة المرور", oldPass: "كلمة المرور القديمة", newPass: "كلمة المرور الجديدة", confirmPass: "تأكيد كلمة المرور الجديدة", updatePass: "تحديث كلمة المرور", passChanged: "تم تحديث كلمة المرور بنجاح!", passMismatch: "كلمتا المرور الجديدتان غير متطابقتين.", wrongOldPass: "كلمة المرور القديمة غير صحيحة.", }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (!newPassword) {
        setPasswordMessage({ type: 'error', text: 'New password cannot be empty.' });
        return;
    }
    if (oldPassword !== currentPassword) {
      setPasswordMessage({type: 'error', text: content[lang].wrongOldPass});
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({type: 'error', text: content[lang].passMismatch});
      return;
    }
    if (onPasswordChange) {
      onPasswordChange(newPassword);
      setPasswordMessage({type: 'success', text: content[lang].passChanged});
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{content[lang].changePass}</h2>
      <form onSubmit={handlePasswordUpdate} className="max-w-sm space-y-4">
        <TextInput label={content[lang].oldPass} value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
        <TextInput label={content[lang].newPass} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <TextInput label={content[lang].confirmPass} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{content[lang].updatePass}</button>
        {passwordMessage && (
          <p className={`mt-2 text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{passwordMessage.text}</p>
        )}
      </form>
    </div>
  );
};

export default Admin;
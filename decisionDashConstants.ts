import type { DecisionDashScenarioNode } from './types';

export const DECISION_DASH_SCENARIOS: DecisionDashScenarioNode[] = [
  {
    id: 'START',
    icon: '📚',
    text: {
      en: 'You have a huge exam tomorrow that you feel unprepared for. A close friend calls, clearly upset about something. What do you do?',
      ar: 'لديك امتحان كبير غداً وتشعر أنك غير مستعد له. يتصل بك صديق مقرب، وهو منزعج بشكل واضح من شيء ما. ماذا تفعل؟',
    },
    choices: [
      {
        text: { en: 'Tell them you\'re busy and will call back tomorrow.', ar: 'أخبرهم أنك مشغول وستعاود الاتصال غداً.' },
        effects: { respect: -5, focus: 15, responsibility: 10 },
        nextId: 'FOCUS_ON_STUDYING',
      },
      {
        text: { en: 'Pause your studying to listen for 15 minutes.', ar: 'توقف عن المذاكرة لتستمع إليه لمدة 15 دقيقة.' },
        effects: { respect: 15, focus: -10, responsibility: 5 },
        nextId: 'LISTEN_TO_FRIEND',
      },
    ],
  },
  {
    id: 'FOCUS_ON_STUDYING',
    icon: '📖',
    text: {
      en: 'You focus and study hard for the rest of the night. You feel more prepared for the exam, but you feel a bit guilty about your friend.',
      ar: 'تركز وتدرس بجد لبقية الليل. تشعر بأنك أكثر استعدادًا للامتحان، لكنك تشعر بقليل من الذنب تجاه صديقك.',
    },
    choices: [
      {
        text: { en: 'Decide that your grades come first.', ar: 'تقرر أن درجاتك تأتي أولاً.' },
        effects: { respect: -5, focus: 10, responsibility: 5 },
        nextId: 'END_FOCUSED',
      },
      {
        text: { en: 'Send a quick text to check in before you sleep.', ar: 'أرسل رسالة نصية سريعة للاطمئنان عليه قبل أن تنام.' },
        effects: { respect: 5, focus: -5, responsibility: 10 },
        nextId: 'END_BALANCED',
      },
    ],
  },
  {
    id: 'LISTEN_TO_FRIEND',
    icon: '💬',
    text: {
      en: 'Your friend feels much better after talking. You feel good for helping, but now you\'ve lost some study time and feel more stressed.',
      ar: 'صديقك يشعر بتحسن كبير بعد التحدث. تشعر بالرضا لمساعدته، لكنك الآن فقدت بعض وقت المذاكرة وتشعر بمزيد من التوتر.',
    },
    choices: [
      {
        text: { en: 'Take a few deep breaths and create a mini-plan for the remaining time.', ar: 'خذ بعض الأنفاس العميقة وأنشئ خطة مصغرة للوقت المتبقي.' },
        effects: { respect: 10, focus: 10, responsibility: 15 },
        nextId: 'END_BALANCED',
      },
      {
        text: { en: 'Panic and try to cram everything at once.', ar: 'تصاب بالذعر وتحاول حشو كل شيء مرة واحدة.' },
        effects: { respect: 0, focus: -15, responsibility: -5 },
        nextId: 'END_STRESSED',
      },
    ],
  },
  {
    id: 'END_FOCUSED',
    icon: '🎯',
    text: {
      en: 'You prioritized your immediate academic needs. It\'s important to focus, but remember to check in on your friends later.',
      ar: 'لقد أعطيت الأولوية لاحتياجاتك الأكاديمية الفورية. من المهم التركيز، لكن تذكر الاطمئنان على أصدقائك لاحقًا.',
    },
    choices: [],
  },
  {
    id: 'END_BALANCED',
    icon: '⚖️',
    text: {
      en: 'Excellent work! You found a way to balance your own needs with supporting a friend. This is a key skill for wellbeing.',
      ar: 'عمل ممتاز! لقد وجدت طريقة للموازنة بين احتياجاتك الخاصة ودعم صديق. هذه مهارة أساسية للسلامة النفسية.',
    },
    choices: [],
  },
  {
    id: 'END_STRESSED',
    icon: '🤯',
    text: {
      en: 'It\'s tough when you try to help but feel overwhelmed yourself. Next time, remember that taking a moment to plan can make a big difference.',
      ar: 'من الصعب أن تحاول المساعدة ولكن تشعر بالإرهاق بنفسك. في المرة القادمة، تذكر أن أخذ لحظة للتخطيط يمكن أن يحدث فرقًا كبيرًا.',
    },
    choices: [],
  },
];
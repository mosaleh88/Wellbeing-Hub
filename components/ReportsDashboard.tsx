

import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { StudentData, ChallengeActivity } from '../types';
import { DEFAULT_CHALLENGE_ACTIVITIES } from '../twentyFourHourChallengeConstants';


// Helper to format the data for the prompt
const summarizeDataForPrompt = (data: StudentData, lang: 'en' | 'ar'): string => {
    return Object.entries(data)
        .filter(([key, value]) => key !== 'studentInfo' && value && (!Array.isArray(value) || value.length > 0))
        .map(([key, value]) => {
            let summary = '';
            try {
                if (key === 'quizAnswers' && Array.isArray(value)) {
                    summary = value.map(a => `- Q: "${a.question[lang]}" A: "${a.answer}"`).join('\n');
                } else if (key === 'moodBoard' && Array.isArray(value)) {
                    summary = value.map(m => `- Felt "${m.label[lang]}" because: "${m.reason}"`).join('\n');
                } else if (key === 'memoryAnswers' && Array.isArray(value)) {
                    summary = value.map(a => `- Reflection for "${a.prompt[lang]}": "${a.answer}"`).join('\n');
                } else if (key === 'decisionPath' && Array.isArray(value)) {
                    summary = `Path taken: ${value.join(' -> ')}`;
                } else if (key === 'mindSnakeResult' || key === 'goalRacerResult' || key === 'runOfChoicesResult') {
                    const result: any = value;
                    summary = `Score: ${result.score || result.focusLevel || result.growthPoints}, Answers: ${result.answers.map((a: any) => `"${a.answer}"`).join(', ')}`;
                } else if (key === 'twentyFourHourChallengeResult' && value) {
                    const result: any = value;
                    const countHours = (day: (string | null)[]) => {
                        const counts: { [key: string]: number } = {};
                        day.forEach(activityId => {
                            if (activityId) {
                                const activity = DEFAULT_CHALLENGE_ACTIVITIES.find(a => a.id === activityId);
                                if (activity) {
                                    counts[activity.name[lang]] = (counts[activity.name[lang]] || 0) + 1;
                                }
                            }
                        });
                        return Object.entries(counts).map(([name, hours]) => `${name}: ${hours}h`).join(', ');
                    };
                    summary = `Current Day: ${countHours(result.currentDay)}\nIdeal Day: ${countHours(result.idealDay)}`;
                }
                else {
                    summary = JSON.stringify(value);
                }
            } catch {
                summary = "Could not process data.";
            }
            return `${key}:\n${summary}`;
        })
        .join('\n\n');
};

interface ParsedReport {
  summary?: string;
  themes?: string;
  strengths?: string;
  discussion?: string;
}

const parseCounsellorReport = (text: string): ParsedReport => {
    return {
        summary: text.split('###SUMMARY###')[1]?.split('###KEY_THEMES###')[0]?.trim(),
        themes: text.split('###KEY_THEMES###')[1]?.split('###POTENTIAL_STRENGTHS###')[0]?.trim(),
        strengths: text.split('###POTENTIAL_STRENGTHS###')[1]?.split('###DISCUSSION_POINTS###')[0]?.trim(),
        discussion: text.split('###DISCUSSION_POINTS###')[1]?.trim(),
    };
};

const RenderReportSection = ({ rawText, defaultTitle }: { rawText: string | undefined, defaultTitle: string }) => {
    if (!rawText) return null;
    const [title, ...items] = rawText.split('\n');
    const content = items.filter(item => item.trim());
    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">{title || defaultTitle}</h3>
            {content.length > 0 ? (
                 <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {content.map((item, index) => <li key={index}>{item.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')}</li>)}
                </ul>
            ) : <p className="text-gray-600 italic">No specific points noted.</p>}
        </div>
    );
};

interface DashboardProps {
  allStudentData: StudentData[];
  onBack: () => void;
  lang: 'en' | 'ar';
}

const ReportsDashboard: React.FC<DashboardProps> = ({ allStudentData, onBack, lang }) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [error, setError] = useState('');

  const content = {
    en: {
      title: "Student Reports",
      subtitle: "Review submitted data and generate AI feedback.",
      noData: "No student data has been submitted yet.",
      backButton: "Back to Admin Hub",
      viewDetails: "View Details",
      hideDetails: "Hide Details",
      generateReport: "Generate Session Report",
      generating: "Your AI assistant is generating the report...",
      error: "Sorry, we couldn't generate the report. Please try again later.",
      reportTitle: "Counsellor Session Preparation Report",
      backToDashboard: "Back to Dashboard",
    },
    ar: {
      title: "تقارير الطلاب",
      subtitle: "مراجعة البيانات المقدمة وإنشاء تقارير الذكاء الاصطناعي.",
      noData: "لم يتم إرسال بيانات أي طالب حتى الآن.",
      backButton: "العودة إلى لوحة التحكم",
      viewDetails: "عرض التفاصيل",
      hideDetails: "إخفاء التفاصيل",
      generateReport: "إنشاء تقرير الجلسة",
      generating: "يقوم مساعدك الذكي بإنشاء التقرير...",
      error: "عذراً، لم نتمكن من إنشاء التقرير. الرجاء المحاولة مرة أخرى في وقت لاحق.",
      reportTitle: "تقرير إعداد جلسة الإرشاد",
      backToDashboard: "العودة إلى لوحة التحكم",
    },
  };

  const handleGenerateReport = async (studentData: StudentData) => {
      setIsGeneratingReport(true);
      setGeneratedReport(null);
      setError('');
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
          setError("API key is not configured. Please ensure VITE_GEMINI_API_KEY is set in your deployment environment.");
          setIsGeneratingReport(false);
          return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const dataSummary = summarizeDataForPrompt(studentData, lang);

        const prompt = `
          You are an AI assistant for a school counsellor. Your task is to analyze a student's activity data and generate a concise session preparation report for the counsellor. The report should be objective, insightful, and help the counsellor prepare for a one-on-one session with the student, ${studentData.studentInfo.name}. The report must be in ${lang === 'en' ? 'English' : 'Arabic'}.

          Please structure the report for the counsellor using these exact headings and separators:

          ###SUMMARY###
          **Session Summary for ${studentData.studentInfo.name}**
          Provide a brief, one-paragraph overview of the student's engagement and overall emotional themes observed from the data.

          ###KEY_THEMES###
          **Key Themes Observed**
          Identify 2-3 prominent themes from the student's responses. Use a bulleted list (using '-'). Examples: "Struggles with academic pressure," "Strong sense of empathy for friends," "Shows interest in creative fields," "Expresses feelings of being overwhelmed."

          ###POTENTIAL_STRENGTHS###
          **Potential Strengths to Affirm**
          Based on the data, list 1-2 positive traits or coping mechanisms the counsellor can acknowledge and reinforce. Use a bulleted list (using '-'). Example: "Resilience in bouncing back after a setback," "Gratitude for small joys."

          ###DISCUSSION_POINTS###
          **Potential Talking Points for Discussion**
          Suggest 2-3 specific, gentle questions the counsellor could use to open a conversation about areas that might need attention. Frame these as open-ended questions. Use a numbered list (using '1.'). Example: "1. Can you tell me more about what it feels like when you're overwhelmed with schoolwork?", "2. I noticed you chose to help your friend. How do you balance supporting others with your own needs?"

          Student's Raw Data Summary (for your context, do not include in the output):
          ---
          ${dataSummary}
          ---
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        setGeneratedReport(response.text);

      } catch (err) {
        console.error("Error generating AI report:", err);
        setError(content[lang].error);
      } finally {
        setIsGeneratingReport(false);
      }
  };


  if (isGeneratingReport || generatedReport || error) {
    const parsedReport = generatedReport ? parseCounsellorReport(generatedReport) : null;
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{content[lang].reportTitle} for {selectedStudent?.studentInfo.name}</h1>
        {isGeneratingReport && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">{content[lang].generating}</p>
          </div>
        )}
        {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
        {parsedReport && (
          <div className="space-y-4" dir="auto">
            <RenderReportSection rawText={parsedReport.summary} defaultTitle="Session Summary" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg"><RenderReportSection rawText={parsedReport.themes} defaultTitle="Key Themes" /></div>
                <div className="p-4 bg-gray-50 rounded-lg"><RenderReportSection rawText={parsedReport.strengths} defaultTitle="Potential Strengths" /></div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg"><RenderReportSection rawText={parsedReport.discussion} defaultTitle="Discussion Points" /></div>
          </div>
        )}
        <div className="text-center mt-8">
          <button onClick={() => { setGeneratedReport(null); setError(''); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            {content[lang].backToDashboard}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{content[lang].title}</h1>
          <p className="text-lg text-gray-600">{content[lang].subtitle}</p>
        </div>
        <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">
          {content[lang].backButton}
        </button>
      </div>

      {allStudentData.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">{content[lang].noData}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allStudentData.map((data, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-700">
                  {data.studentInfo.name} - {data.studentInfo.grade}
                </h2>
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => setSelectedStudent(selectedStudent?.studentInfo.name === data.studentInfo.name ? null : data)}
                    className="text-sm font-semibold text-indigo-600 hover:underline px-3 py-1"
                  >
                    {selectedStudent?.studentInfo.name === data.studentInfo.name ? content[lang].hideDetails : content[lang].viewDetails}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStudent(data);
                      handleGenerateReport(data);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                  >
                    {content[lang].generateReport}
                  </button>
                </div>
              </div>
              {selectedStudent?.studentInfo.name === data.studentInfo.name && (
                <div className="mt-4 p-4 bg-white border rounded-md text-sm animate-fade-in">
                  <pre className="whitespace-pre-wrap break-all">{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;



import React, { useState, useEffect } from 'react';
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
  greeting?: string;
  strengths?: string;
  growth?: string;
  recommendation?: string;
  closing?: string;
}

interface Props {
  studentData: StudentData;
  onReset: () => void;
  lang: 'en' | 'ar';
}

const AIReport: React.FC<Props> = ({ studentData, onReset, lang }) => {
  const [parsedReport, setParsedReport] = useState<ParsedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const content = {
    en: {
      title: "Your Wellbeing Report",
      generating: "Your school counsellor is generating your personalized report...",
      error: "Sorry, we couldn't generate the report. Please try again later.",
      startOver: "Start Over",
    },
    ar: {
      title: "تقرير السلامة النفسية الخاص بك",
      generating: "يقوم مرشدك المدرسي بإنشاء تقريرك الشخصي...",
      error: "عذراً، لم نتمكن من إنشاء التقرير. الرجاء المحاولة مرة أخرى في وقت لاحق.",
      startOver: "ابدأ من جديد",
    }
  };

  useEffect(() => {
    const generateReport = async () => {
      setIsLoading(true);
      setError('');
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
          setError("API key is not configured. Please ensure VITE_GEMINI_API_KEY is set in your deployment environment.");
          setIsLoading(false);
          return;
      }
      
      try {
        const ai = new GoogleGenAI({ apiKey });
        const dataSummary = summarizeDataForPrompt(studentData, lang);

        const prompt = `
          You are a compassionate and insightful school counsellor providing a holistic wellbeing report for a student named ${studentData.studentInfo.name}. Your goal is to offer positive reinforcement, identify potential areas for growth, and give gentle, actionable recommendations based on their activity data. The report must be in ${lang === 'en' ? 'English' : 'Arabic'}.

          Your tone should be:
          - Supportive and non-judgmental.
          - Encouraging and positive.
          - Easy for a young person to understand, avoiding clinical jargon.

          Please structure the report EXACTLY as follows, using these specific headings and separators:

          ###GREETING###
          A warm, personal greeting to ${studentData.studentInfo.name}.

          ###STRENGTHS###
          **🌟 Your Strengths**
          Based on their answers across ALL activities, identify 1-2 key strengths in a bulleted list (using '-'). Start each point with a positive observation. Synthesize information from the data provided.

          ###GROWTH###
          **🤔 Something to Think About**
          Gently introduce one area for reflection in a short paragraph. Frame it as an opportunity, not a flaw.

          ###RECOMMENDATION###
          **🚀 A Small Step to Try**
          Provide ONE simple, concrete suggestion they can try. It should be related to the opportunity for growth.

          ###CLOSING###
          An uplifting and kind closing statement.
        `;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text;
        const sections: ParsedReport = {
            greeting: text.split('###GREETING###')[1]?.split('###STRENGTHS###')[0]?.trim(),
            strengths: text.split('###STRENGTHS###')[1]?.split('###GROWTH###')[0]?.trim(),
            growth: text.split('###GROWTH###')[1]?.split('###RECOMMENDATION###')[0]?.trim(),
            recommendation: text.split('###RECOMMENDATION###')[1]?.split('###CLOSING###')[0]?.trim(),
            closing: text.split('###CLOSING###')[1]?.trim(),
        };
        setParsedReport(sections);

      } catch (err) {
        console.error("Error generating AI report:", err);
        setError(content[lang].error);
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();
  }, [studentData, lang]);

  const renderSection = (rawText: string | undefined) => {
    if (!rawText) return null;
    const [title, ...listItems] = rawText.split('\n');
    return (
      <>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
            {listItems.map((item, index) => item.trim() && <li key={index}>{item.replace(/^- /, '')}</li>)}
        </ul>
      </>
    );
  };
  
   const renderParagraph = (rawText: string | undefined) => {
    if (!rawText) return null;
    const [title, ...paragraphs] = rawText.split('\n');
     return (
        <>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-700">{paragraphs.join('\n')}</p>
        </>
    );
   }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">{content[lang].title}</h1>
      
      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">{content[lang].generating}</p>
        </div>
      )}

      {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}

      {!isLoading && !error && parsedReport && (
        <div className="space-y-6" dir="auto">
            {parsedReport.greeting && <p className="text-xl text-gray-800">{parsedReport.greeting}</p>}
            
            {parsedReport.strengths && (
                <div className="p-5 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                    {renderSection(parsedReport.strengths)}
                </div>
            )}

            {parsedReport.growth && (
                <div className="p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                    {renderParagraph(parsedReport.growth)}
                </div>
            )}
            
            {parsedReport.recommendation && (
                 <div className="p-5 bg-sky-50 border-l-4 border-sky-400 rounded-r-lg">
                    {renderParagraph(parsedReport.recommendation)}
                </div>
            )}

            {parsedReport.closing && <p className="text-lg font-semibold text-gray-800 text-center pt-4">{parsedReport.closing}</p>}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {content[lang].startOver}
        </button>
      </div>
    </div>
  );
};

export default AIReport;

// src/api/groq.js
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function askGroq(messages) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
     body: JSON.stringify({
    model: 'openai/gpt-oss-120b',
    messages: messages,
    temperature: 0.3, // <-- Add this (lower = more focused/strict)
  })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }
  
  return response.json();
}

// --- ORIGINAL STUDYBUDDY FUNCTIONS ---
export async function generateSummary(text) {
  return askGroq([
    { role: 'system', content: 'You are a helpful study assistant. Summarize the following text concisely.' },
    { role: 'user', content: text }
  ]);
}

export async function generateFlashcards(text) {
  return askGroq([
    { role: 'system', content: 'Generate 5 flashcards from this text. Format exactly as:\n**Card 1:**\nFront: [question]\nBack: [answer]\n\n**Card 2:**\nFront: [question]\nBack: [answer]' },
    { role: 'user', content: text }
  ]);
}

export async function generateQuiz(text) {
  return askGroq([
    { role: 'system', content: 'Generate a 5-question multiple choice quiz. Format EXACTLY as:\nQ1: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: A\n\nQ2: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: B\n\nQ3: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: C\n\nQ4: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: D\n\nQ5: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: A' },
    { role: 'user', content: text }
  ]);
}

// --- NEW PLACEMENT GUIDE FUNCTIONS ---
export async function analyzeResume(resumeText, jobRole = "Software Engineer") {
  const systemPrompt = `You are a ruthless, expert technical recruiter and ATS (Applicant Tracking System) optimizer.
  Analyze the following resume text for a ${jobRole} position. 
  
  DO NOT just summarize the resume. You must provide critical, actionable feedback.
  
  Format your response EXACTLY using these Markdown headers:
  
  ### 1. Overall Impression
  (2-3 sentences summarizing the resume's impact and readiness for the role)
  
  ### 2. Strengths
  (Bullet points of what is working well)
  
  ### 3. Areas for Improvement
  (Bullet points. Be very critical. Look for: missing metrics, weak action verbs, vague descriptions, formatting issues, lack of quantifiable results)
  
  ### 4. Missing ATS Keywords
  (List specific technical keywords/skills that are missing for a ${jobRole} role)
  
  ### 5. Actionable Next Steps
  (3 concrete things the user must change immediately to improve their chances)`;

  return askGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Here is my resume text:\n\n${resumeText}` }
  ]);
}

export async function startMockInterview(jobRole = "Software Engineer") {
  const systemPrompt = `You are a strict but fair technical interviewer interviewing a candidate for a ${jobRole} role. 
  Start the interview by greeting the candidate and asking the first question (e.g., "Tell me about yourself" or a basic technical question). 
  Wait for the candidate's response before moving on. Ask one question at a time. 
  If the candidate asks for feedback, provide brief feedback, then ask the next question.`;

  return askGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Start the interview.' }
  ]);
}

export async function continueMockInterview(messages) {
  return askGroq(messages);
}
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export async function askGroq(messages) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: messages
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Groq API error: ${error}`)
  }
  
  return response.json()
}

export async function generateSummary(text) {
  return askGroq([
    { role: 'system', content: 'You are a helpful study assistant. Summarize the following text concisely.' },
    { role: 'user', content: text }
  ])
}

export async function generateFlashcards(text) {
  return askGroq([
    { role: 'system', content: 'Generate 5 flashcards from this text. Format exactly as:\n**Card 1:**\nFront: [question]\nBack: [answer]\n\n**Card 2:**\nFront: [question]\nBack: [answer]' },
    { role: 'user', content: text }
  ])
}

export async function generateQuiz(text) {
  return askGroq([
    { role: 'system', content: 'Generate a 5-question multiple choice quiz. Format EXACTLY as:\nQ1: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: A\n\nQ2: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: B\n\nQ3: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: C\n\nQ4: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: D\n\nQ5: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: A' },
    { role: 'user', content: text }
  ])
}
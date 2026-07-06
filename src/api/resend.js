// src/api/resend.js — Production safe!
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export async function sendEmail({ to, subject, html, from = 'onboarding@resend.dev' }) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ from, to, subject, html })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Email send failed: ${error}`)
  }
  
  return response.json()
}

export async function sendStudyReminder(email, studyPlan) {
  return sendEmail({
    to: email,
    subject: '📚 StudyBuddy Daily Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Your Daily Study Plan</h2>
        <p>Here's what you planned for today:</p>
        <ul>
          ${studyPlan.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <p style="color: #666;">Keep up the great work! 🚀</p>
      </div>
    `
  })
}
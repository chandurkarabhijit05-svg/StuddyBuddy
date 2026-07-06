const RESEND_FROM = 'StudyBuddy <onboarding@resend.dev>'
const RESEND_URL = '/api/resend/emails'

export async function sendEmail({ to, subject, html, from = RESEND_FROM }) {
  const response = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from, to, subject, html })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Email send failed: ${error}`)
  }
  
  return response.json()
}

export async function sendWelcomeEmail(userEmail, userName) {
  try {
    const data = await sendEmail({
      to: [userEmail],
      subject: 'Welcome to StudyBuddy!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0;">StudyBuddy</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Welcome aboard!</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <p style="color: #334155; font-size: 16px;">Hi ${userName || 'there'},</p>
            <p style="color: #475569; font-size: 15px;">
              Welcome to StudyBuddy! Start uploading PDFs to generate summaries, flashcards, and quizzes.
            </p>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Sent at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    })

    return { success: true, message: 'Welcome email sent!' }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, message: error.message }
  }
}

export async function sendPDFProcessedEmail(userEmail, fileName) {
  try {
    const data = await sendEmail({
      to: [userEmail],
      subject: `Your PDF "${fileName}" is ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0;">StudyBuddy</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">PDF Processing Complete</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <p style="color: #334155; font-size: 16px;">Great news!</p>
            <p style="color: #475569; font-size: 15px;">
              Your PDF <strong>"${fileName}"</strong> has been processed. Your summary, flashcards, and quiz are now ready!
            </p>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Sent at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    })

    return { success: true, message: 'PDF notification sent!' }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, message: error.message }
  }
}

export async function sendStudyReminder(email, studyPlan) {
  try {
    const data = await sendEmail({
      to: [email],
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
      `,
    })

    return { success: true, message: 'Reminder sent!' }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, message: error.message }
  }
}
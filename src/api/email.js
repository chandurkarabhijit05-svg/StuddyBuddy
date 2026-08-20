// src/api/email.js
import { callResend } from './resend.js';

/**
 * Send a basic email
 */
export async function sendEmail({ to, from, subject, html, text }) {
  return callResend('/emails', {
    to: Array.isArray(to) ? to : [to],
    from,
    subject,
    html,
    text: text || '',
  });
}

/**
 * Send study streak reminder
 */
export async function sendStreakReminder({ to, userName, streakDays, lastStudyDate }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; padding: 24px; color: #e2e8f0; }
        .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 32px 24px; text-align: center; }
        .header h1 { color: #fff; font-size: 22px; font-weight: 700; }
        .content { padding: 28px 24px; }
        .streak-box { background: #0f172a; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px; border: 1px solid #334155; }
        .streak-number { font-size: 48px; font-weight: 800; color: #f97316; line-height: 1; }
        .streak-label { color: #94a3b8; font-size: 14px; margin-top: 4px; }
        .cta { text-align: center; margin-top: 24px; }
        .cta-button { display: inline-block; background: #7c3aed; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; }
        .footer { padding: 20px 24px; text-align: center; border-top: 1px solid #334155; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🔥 StudyBuddy</h1></div>
        <div class="content">
          <p style="color: #94a3b8; margin-bottom: 16px;">Hi <strong style="color: #fff;">${userName}</strong>,</p>
          <p style="color: #cbd5e1; margin-bottom: 20px;">Don't break your streak! You haven't studied since <strong>${lastStudyDate}</strong>.</p>
          <div class="streak-box">
            <div class="streak-number">${streakDays}</div>
            <div class="streak-label">day streak 🔥</div>
          </div>
          <div class="cta"><a href="#" class="cta-button">Continue Studying</a></div>
        </div>
        <div class="footer">
          <p style="color: #a855f7; font-weight: 700; margin-bottom: 4px;">StudyBuddy</p>
          <p>AI-Powered Study Assistant</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    from: 'chandurkarabhijit05@gmail.com', 
    subject: `🔥 Don't lose your ${streakDays}-day streak!`,
    html,
  });
}

/**
 * Send PDF processing complete notification
 */
export async function sendPDFReadyEmail({ to, userName, fileName, summaryUrl }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; padding: 24px; color: #e2e8f0; }
        .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
        .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center; }
        .header h1 { color: #fff; font-size: 22px; font-weight: 700; }
        .content { padding: 28px 24px; }
        .success-badge { display: inline-flex; align-items: center; gap: 6px; background: #064e3b; color: #34d399; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 9999px; margin-bottom: 16px; }
        .file-box { background: #0f172a; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #334155; }
        .file-name { color: #fff; font-weight: 600; font-size: 15px; }
        .cta { text-align: center; margin-top: 24px; }
        .cta-button { display: inline-block; background: #059669; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; }
        .footer { padding: 20px 24px; text-align: center; border-top: 1px solid #334155; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>✅ StudyBuddy</h1></div>
        <div class="content">
          <div class="success-badge">● Processing Complete</div>
          <p style="color: #94a3b8; margin-bottom: 16px;">Hi <strong style="color: #fff;">${userName}</strong>,</p>
          <p style="color: #cbd5e1;">Your PDF has been analyzed! Here's what we found:</p>
          <div class="file-box">
            <div class="file-name">📄 ${fileName}</div>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">Summary, flashcards, and quiz are now ready.</p>
          <div class="cta"><a href="${summaryUrl}" class="cta-button">View Results</a></div>
        </div>
        <div class="footer">
          <p style="color: #10b981; font-weight: 700; margin-bottom: 4px;">StudyBuddy</p>
          <p>AI-Powered Study Assistant</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    from: 'chandurkarabhijit05@gmail.com', // ⚠️ REPLACE with your verified domain
    subject: `✅ Your PDF "${fileName}" is ready!`,
    html,
  });
}

/**
 * Send weekly study summary
 */
export async function sendWeeklySummary({ to, userName, stats }) {
  // Similar pattern...
}
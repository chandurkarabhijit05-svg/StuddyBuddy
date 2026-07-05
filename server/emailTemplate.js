// emailTemplate.js

export function generateEmailTemplate({ summary, flashcards, quiz, chatHistory }) {
  // Parse chat history if it's a string
  let parsedChatHistory = [];
  if (Array.isArray(chatHistory)) {
    parsedChatHistory = chatHistory;
  } else if (typeof chatHistory === "string" && chatHistory.trim()) {
    const pairs = chatHistory.split(/\n\s*\n/);
    pairs.forEach((pair) => {
      const lines = pair.split("\n");
      const qLine = lines.find((l) => l.startsWith("Q:"));
      const aLine = lines.find((l) => l.startsWith("A:"));
      if (qLine && aLine) {
        parsedChatHistory.push({
          question: qLine.replace("Q:", "").trim(),
          answer: aLine.replace("A:", "").trim(),
        });
      }
    });
  }

  // Build chat HTML
  const chatHtml =
    parsedChatHistory.length > 0
      ? parsedChatHistory
          .map(
            (chat) => `
        <div style="margin-bottom: 16px; padding: 16px; border-radius: 16px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(6, 182, 212, 0.08)); border: 1px solid rgba(59, 130, 246, 0.2); margin-right: 20px; border-bottom-left-radius: 4px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #60a5fa; display: block; margin-bottom: 6px;">You Asked</span>
          <p style="color: #e2e8f0; font-size: 13px; line-height: 1.6; margin: 0;">${escapeHtml(chat.question)}</p>
        </div>
        <div style="margin-bottom: 24px; padding: 16px; border-radius: 16px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(168, 85, 247, 0.08)); border: 1px solid rgba(139, 92, 246, 0.2); margin-left: 20px; border-bottom-right-radius: 4px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #c084fc; display: block; margin-bottom: 6px;">AI Answered</span>
          <p style="color: #e2e8f0; font-size: 13px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(chat.answer)}</p>
        </div>
      `
          )
          .join("")
      : `<p style="color: #64748b; text-align: center; font-size: 13px;">No chat history available</p>`;

  // Format content with line breaks preserved
  const formatContent = (content) => {
    if (!content) return '<p style="color: #64748b; text-align: center; font-size: 13px;">No content generated</p>';
    return `<pre style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 12px; padding: 16px; color: #e2e8f0; font-size: 13px; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0;">${escapeHtml(content)}</pre>`;
  };

  const summaryHtml = formatContent(summary);
  const flashcardsHtml = formatContent(flashcards);
  const quizHtml = formatContent(quiz);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your PDF Analysis Report</title>
  <style>
    @media screen and (max-width: 600px) {
      .content { padding: 0 20px 20px !important; }
      .header { padding: 30px 20px !important; }
      .header h1 { font-size: 22px !important; }
      .stat-item { display: block !important; width: 100% !important; margin-bottom: 8px !important; border-radius: 12px !important; border: 1px solid rgba(124, 58, 237, 0.15) !important; }
      .stats-row { display: block !important; }
      .section-header { padding: 16px 20px !important; }
      .section-body { padding: 16px 20px !important; }
      .cta-button { width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="background-color: #0f172a; padding: 20px 0;">
        
        <!-- Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="680" style="max-width: 680px; width: 100%; background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);">
          
          <!-- Animated Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%); padding: 45px 30px; text-align: center; position: relative; overflow: hidden;">
              <!-- Decorative dots pattern -->
              <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 24px 24px; opacity: 0.4;"></div>
              
              <div style="position: relative; z-index: 1;">
                <!-- Logo Icon -->
                <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.12); border-radius: 18px; display: inline-block; margin-bottom: 18px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); text-align: center; line-height: 64px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    <path d="M5 3v4"/>
                    <path d="M19 17v4"/>
                    <path d="M3 5h4"/>
                    <path d="M17 19h4"/>
                  </svg>
                </div>
                <h1 style="color: #ffffff; font-size: 30px; font-weight: 800; margin: 0 0 10px 0; letter-spacing: -0.5px;">Your PDF Analysis Report</h1>
                <p style="color: rgba(255,255,255,0.85); font-size: 15px; margin: 0; font-weight: 400;">AI-powered insights delivered to your inbox</p>
                
                <!-- Decorative line -->
                <div style="width: 60px; height: 3px; background: rgba(255,255,255,0.4); border-radius: 2px; margin: 20px auto 0;"></div>
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 0 30px 30px;">
              
              <!-- Stats Overview -->
              <div class="stats-row" style="display: table; width: 100%; margin: 28px 0;">
                <div class="stat-item" style="display: table-cell; width: 33.33%; text-align: center; padding: 22px 16px; background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 12px 0 0 12px;">
                  <span style="font-size: 28px; display: block; margin-bottom: 6px;">&#128196;</span>
                  <span style="color: #a855f7; font-size: 26px; font-weight: 800; display: block; margin-bottom: 4px;">1</span>
                  <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Document</span>
                </div>
                <div class="stat-item" style="display: table-cell; width: 33.33%; text-align: center; padding: 22px 16px; background: rgba(124, 58, 237, 0.08); border-top: 1px solid rgba(124, 58, 237, 0.15); border-bottom: 1px solid rgba(124, 58, 237, 0.15);">
                  <span style="font-size: 28px; display: block; margin-bottom: 6px;">&#9889;</span>
                  <span style="color: #a855f7; font-size: 26px; font-weight: 800; display: block; margin-bottom: 4px;">3</span>
                  <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">AI Features</span>
                </div>
                <div class="stat-item" style="display: table-cell; width: 33.33%; text-align: center; padding: 22px 16px; background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.15); border-radius: 0 12px 12px 0;">
                  <span style="font-size: 28px; display: block; margin-bottom: 6px;">&#9989;</span>
                  <span style="color: #a855f7; font-size: 26px; font-weight: 800; display: block; margin-bottom: 4px;">100%</span>
                  <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Analyzed</span>
                </div>
              </div>
              
              <!-- Summary Section -->
              <div style="background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 20px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);">
                <div class="section-header" style="padding: 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <div style="width: 40px; height: 40px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #3b82f6, #06b6d4); flex-shrink: 0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                  <h2 style="color: #f8fafc; font-size: 18px; font-weight: 700; margin: 0;">AI Summary</h2>
                </div>
                <div class="section-body" style="padding: 20px 24px; color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                  ${summaryHtml}
                </div>
              </div>
              
              <!-- Flashcards Section -->
              <div style="background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 20px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);">
                <div class="section-header" style="padding: 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <div style="width: 40px; height: 40px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #8b5cf6, #a855f7); flex-shrink: 0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
                      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
                      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
                    </svg>
                  </div>
                  <h2 style="color: #f8fafc; font-size: 18px; font-weight: 700; margin: 0;">Flashcards</h2>
                </div>
                <div class="section-body" style="padding: 20px 24px; color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                  ${flashcardsHtml}
                </div>
              </div>
              
              <!-- Quiz Section -->
              <div style="background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 20px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);">
                <div class="section-header" style="padding: 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <div style="width: 40px; height: 40px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f59e0b, #f97316); flex-shrink: 0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <path d="M12 17h.01"/>
                    </svg>
                  </div>
                  <h2 style="color: #f8fafc; font-size: 18px; font-weight: 700; margin: 0;">Quiz</h2>
                </div>
                <div class="section-body" style="padding: 20px 24px; color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                  ${quizHtml}
                </div>
              </div>
              
              <!-- Chat History Section -->
              <div style="background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 20px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);">
                <div class="section-header" style="padding: 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <div style="width: 40px; height: 40px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f43f5e, #ec4899); flex-shrink: 0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                    </svg>
                  </div>
                  <h2 style="color: #f8fafc; font-size: 18px; font-weight: 700; margin: 0;">Chat History</h2>
                </div>
                <div class="section-body" style="padding: 20px 24px; color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                  ${chatHtml}
                </div>
              </div>
              
              <!-- CTA Section -->
              <div style="text-align: center; padding: 35px 30px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1)); border-radius: 20px; margin: 28px 0; border: 1px solid rgba(124, 58, 237, 0.2);">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #7c3aed, #a855f7); border-radius: 14px; display: inline-block; margin-bottom: 16px; line-height: 48px; text-align: center; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                  </svg>
                </div>
                <p style="color: #e2e8f0; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Want to analyze another document?</p>
                <p style="color: #94a3b8; font-size: 13px; margin: 0 0 20px 0;">Upload a new PDF and unlock more AI-powered insights.</p>
                <a href="#" class="cta-button" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 24px rgba(124, 58, 237, 0.4); letter-spacing: 0.3px;">Upload New PDF &rarr;</a>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 30px; border-top: 1px solid rgba(255,255,255,0.05);">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), transparent); margin: 0 0 24px 0;"></div>
              <p style="font-size: 14px; color: #94a3b8; margin: 0 0 4px 0;">
                <strong style="color: #a855f7; font-weight: 700;">Study Buddy AI</strong>
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0 0 16px 0;">Powered by Artificial Intelligence</p>
              
              <!-- Social Links -->
              <div style="margin: 16px 0;">
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background: rgba(255,255,255,0.05); border-radius: 10px; margin: 0 6px; text-align: center; line-height: 38px; border: 1px solid rgba(255,255,255,0.1); text-decoration: none;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                </a>
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background: rgba(255,255,255,0.05); border-radius: 10px; margin: 0 6px; text-align: center; line-height: 38px; border: 1px solid rgba(255,255,255,0.1); text-decoration: none;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background: rgba(255,255,255,0.05); border-radius: 10px; margin: 0 6px; text-align: center; line-height: 38px; border: 1px solid rgba(255,255,255,0.1); text-decoration: none;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
              
              <p style="font-size: 11px; color: #475569; margin: 0; line-height: 1.6;">
                You're receiving this because you requested a PDF analysis report.<br>
                <a href="#" style="color: #7c3aed; text-decoration: none;">Unsubscribe</a> &bull; 
                <a href="#" style="color: #7c3aed; text-decoration: none;">Privacy Policy</a> &bull; 
                <a href="#" style="color: #7c3aed; text-decoration: none;">Support</a>
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Helper to escape HTML and prevent injection
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
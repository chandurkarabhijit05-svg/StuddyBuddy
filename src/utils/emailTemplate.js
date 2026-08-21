export function buildReportHtml({ fileName, summary, flashcards, quiz }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #0f172a;
          padding: 24px;
          color: #e2e8f0;
          line-height: 1.6;
        }
        .container {
          max-width: 640px;
          margin: 0 auto;
          background: #1e293b;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #334155;
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 { color: #fff; font-size: 24px; font-weight: 700; }
        .header p { color: #c4b5fd; font-size: 14px; margin-top: 4px; }
        .content { padding: 28px 24px; }
        .section {
          margin-bottom: 24px;
          padding: 20px;
          background: #0f172a;
          border-radius: 16px;
          border: 1px solid #334155;
        }
        .section:last-child { margin-bottom: 0; }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .summary-title { color: #60a5fa; }
        .flashcards-title { color: #a78bfa; }
        .quiz-title { color: #fbbf24; }
        .section-body {
          color: #cbd5e1;
          font-size: 14px;
          white-space: pre-wrap;
          line-height: 1.7;
        }
        .meta {
          background: #0f172a;
          padding: 16px 24px;
          border-top: 1px solid #334155;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .meta-text { color: #64748b; font-size: 12px; }
        .footer {
          padding: 20px 24px;
          text-align: center;
          border-top: 1px solid #334155;
          color: #64748b;
          font-size: 12px;
        }
        .footer-brand { color: #a855f7; font-weight: 700; font-size: 14px; margin-bottom: 4px; }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .badge-summary { background: #1e3a8a; color: #60a5fa; }
        .badge-flashcards { background: #4c1d95; color: #a78bfa; }
        .badge-quiz { background: #78350f; color: #fbbf24; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 StudyBuddy AI Report</h1>
          <p>${fileName || "Your PDF Document"}</p>
        </div>

        <div class="content">
          ${summary ? `
          <div class="section">
            <div class="section-title summary-title">
              <span>📝</span> Summary <span class="badge badge-summary">Generated</span>
            </div>
            <div class="section-body">${summary.replace(/\n/g, "<br>")}</div>
          </div>
          ` : ""}

          ${flashcards ? `
          <div class="section">
            <div class="section-title flashcards-title">
              <span>🗂️</span> Flashcards <span class="badge badge-flashcards">Generated</span>
            </div>
            <div class="section-body">${flashcards.replace(/\n/g, "<br>")}</div>
          </div>
          ` : ""}

          ${quiz ? `
          <div class="section">
            <div class="section-title quiz-title">
              <span>❓</span> Quiz <span class="badge badge-quiz">Generated</span>
            </div>
            <div class="section-body">${quiz.replace(/\n/g, "<br>")}</div>
          </div>
          ` : ""}
        </div>

        <div class="meta">
          <span class="meta-text">Generated on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          <span class="meta-text">${[summary && "Summary", flashcards && "Flashcards", quiz && "Quiz"].filter(Boolean).join(" • ")}</span>
        </div>

        <div class="footer">
          <p class="footer-brand">StudyBuddy</p>
          <p>AI-Powered Study Assistant • studybuddy.app</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function buildReportText({ fileName, summary, flashcards, quiz }) {
  return `
StudyBuddy AI Report
Document: ${fileName || "Your PDF"}

${summary ? "--- SUMMARY ---\n" + summary + "\n\n" : ""}${flashcards ? "--- FLASHCARDS ---\n" + flashcards + "\n\n" : ""}${quiz ? "--- QUIZ ---\n" + quiz + "\n\n" : ""}
Generated on ${new Date().toLocaleString()}
  `.trim();
}
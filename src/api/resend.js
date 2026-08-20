// src/api/resend.js
const RESEND_PROXY_URL = '/api/resend';

/**
 * Generic Resend API caller via Vite proxy
 */
export async function callResend(endpoint, body) {
  const response = await fetch(`${RESEND_PROXY_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // Clone response so we can read it twice if needed
  const responseClone = response.clone();

  if (!response.ok) {
    let errorMessage = `Resend API error: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.message || JSON.stringify(error);
    } catch {
      // If not JSON, try text
      try {
        const text = await responseClone.text();
        errorMessage = text.slice(0, 200) || errorMessage;
      } catch { /* ignore */ }
    }
    throw new Error(errorMessage);
  }

  return response.json();
}